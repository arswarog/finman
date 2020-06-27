import { Month } from '../../models/month/month.class';
import { Account } from '../../models/account/account.class';
import { Helpers } from '../helpers';
import { UUID } from '../../models/common/common.types';
import { SagaPacker } from '../saga-launcher';
import { Accounts, IAccountsState } from '../../atoms/accounts/accounts.atom';
import { select, put, take } from 'redux-saga/effects';
import { saveAccount, saveAccountSuccess, saveAccountFailed } from '../../atoms/accounts/accounts.actions';
import { MonthUtils } from './month.saga';
import { RequiredMonthsError } from '../../models/account/chain.utils';
import { SagaUtils } from '../helpers/helpers';
import { IMonthBrief } from '../../models/month/month.types';

export const AccountUtils = {
    select: SagaPacker.call(selectAccountSaga),
    update: SagaPacker.call(updateAccountSaga),
    save: SagaPacker.call(saveAccountSaga),
};

/**
 * Select account from Store
 * @param id
 */
function* selectAccountSaga(id: UUID) {
    const accounts: IAccountsState = yield select(getState => getState(Accounts));
    const account: Account = accounts.accounts.get(id);

    if (!account)
        throw new Error(`Account "${id}" not found`);

    return account;
}

/**
 * Обновляет месяц в аккаунте, при необходимости правит оставшуюся цепочку, сохраняет
 * @param account
 * @param month
 */
function* updateAccountSaga(account: Account, month: Month) {
    console.log(account.months.map(item => item.month));
    let currentMonthIndex = account.months.findIndex(item => item.month === month.month);
    let prevMonthIndex = account.months.findIndex(item => item.month < month.month);

    let toIndex = currentMonthIndex === -1
        ? prevMonthIndex
        : currentMonthIndex;

    const monthsIds: UUID[] = account.months
                                     .slice(0, toIndex)
                                     .map(item => item.id);

    const additions: Month[] = [month];

    if (monthsIds.length)
        additions.push(...yield* MonthUtils.getByIds(monthsIds));

    const timestamp = yield* SagaUtils.getTimestamp();

    console.log({
        currentMonthIndex,
        prevMonthIndex,
        toIndex,
        months: account.months
                       .slice(0, toIndex + 1)
                       .map(item => item.month),
    });

    let {accountToUpdate, monthsToUpdate} = updateAccount(account, month, timestamp, additions);
    yield* MonthUtils.save(monthsToUpdate);
    yield* AccountUtils.save(accountToUpdate);
    return accountToUpdate;
}

export function updateAccount(account: Account, month: Month, timestamp: number, additionalMonths: Month[]): {
    accountToUpdate: Account,
    monthsToUpdate: Month[],
} {
    additionalMonths = [month, ...additionalMonths];
    const monthsToUpdate = [month];

    console.log('additional');
    console.log(additionalMonths.map(item => `${item.month} ${item.id}`));
    console.log('chain');
    console.log(account.months.map(item => `${item.month} ${item.id}`));

    let startIndex = account.months.findIndex(item => item.month === month.month);
    console.log('startIndex', startIndex);

    let previousMonth: Month = month;

    for (let index = startIndex - 1; index >= 0; index--) {
        console.log('index', index, account.months[index].month);
        const currentMonthId = account.months[index].id;
        const currentMonth = additionalMonths.find(item => item.id === currentMonthId);
        if (!currentMonth)
            throw new RequiredMonthsError(currentMonthId);
        previousMonth = currentMonth.updatePrevMonths([previousMonth], timestamp);
        additionalMonths.push(previousMonth);
        monthsToUpdate.push(previousMonth);
    }

    const accountToUpdate = account.updateHead(previousMonth, additionalMonths);
    return {
        accountToUpdate,
        monthsToUpdate,
    };
}

export function* saveAccountSaga(account: Account) {
    yield put(saveAccount(account));
    for (; ;) {
        const action = yield take([saveAccountSuccess, saveAccountFailed]);
        if (action.type === saveAccountSuccess.getType()) {
            if (action.payload === account.id)
                return;
        } else {
            if (action.payload.id === account.id)
                throw action.payload.error;
        }
    }
}
