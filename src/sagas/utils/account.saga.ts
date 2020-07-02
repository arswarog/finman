import { Month } from '../../models/month/month.class';
import { Account } from '../../models/account/account.class';
import { UUID } from '../../models/common/common.types';
import { SagaPacker } from '../saga-launcher';
import { Accounts, IAccountsState } from '../../atoms/accounts/accounts.atom';
import { select, put, take } from 'redux-saga/effects';
import { saveAccount, saveAccountSuccess, saveAccountFailed } from '../../atoms/accounts/accounts.actions';
import { MonthUtils } from './month.saga';
import { isVersionOfMonth, RequiredMonthsError } from '../../models/account/chain.utils';
import { SagaUtils } from '../helpers/helpers';

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
 *
 * FIXME So raw. Needs refactoring
 *
 * @param account
 * @param month
 */
function* updateAccountSaga(account: Account, month: Month) {
    console.log('*** updateAccountSaga');
    console.log(account.months.map(item => item.month));
    console.log(month.month, month.id);
    let currentMonthIndex = account.months.findIndex(item => item.month === month.month);
    let prevMonthIndex = account.months.findIndex(item => item.month < month.month);

    if (!account.head) {
        yield* MonthUtils.save([month]);
        const accountToUpdate = account.updateHead(month);
        yield* AccountUtils.save(accountToUpdate);
        return accountToUpdate;
    }


    let toIndex = currentMonthIndex === -1
        ? prevMonthIndex
        : currentMonthIndex;

    const monthsIds: UUID[] = account.months
                                     .slice(0, toIndex + 1)
                                     .map(item => item.id);

    const additionalMonths: Month[] = [month];

    console.log(monthsIds);

    if (monthsIds.length)
        additionalMonths.push(...yield* MonthUtils.getByIds(monthsIds));

    const timestamp = yield* SagaUtils.getTimestamp();

    console.log({
        currentMonthIndex,
        prevMonthIndex,
        toIndex,
        additions: additionalMonths.map(item => [item.month + ' ' + item.id]),
        months: account.months
                       .slice(0, toIndex + 1)
                       .map(item => item.month),
    });

    let monthsToUpdate = [month];

    console.log('additional');
    console.log(additionalMonths.map(item => `${item.month} ${item.id}`));
    console.log('chain');
    console.log(account.months.map(item => `${item.month} ${item.id}`));

    console.log('prevMonthIndex', prevMonthIndex, account.months[prevMonthIndex]?.month);

    if (currentMonthIndex === -1 && prevMonthIndex === -1)
        throw new Error('Unexpection');

    if (currentMonthIndex === -1 && prevMonthIndex !== -1) {
        currentMonthIndex = prevMonthIndex;
    } else {
        const existsMonth = account.months[currentMonthIndex];
        if (existsMonth.month !== month.month)
            throw new Error('somethings wrong');
        if (!isVersionOfMonth(month, existsMonth))
            throw new Error('somethings wrong');

    }

    console.log('currentMonthIndex', currentMonthIndex, account.months[currentMonthIndex]?.month);
    if (currentMonthIndex !== -1) {
        let previousMonth: Month = month;

        for (let index = currentMonthIndex - 1; index >= 0; index--) {
            console.log('index', index, account.months[index].month);
            const currentMonthId = account.months[index].id;
            const currentMonth = additionalMonths.find(item => item.id === currentMonthId);
            if (!currentMonth)
                throw new RequiredMonthsError(currentMonthId);
            previousMonth = currentMonth.updatePrevMonths([previousMonth], timestamp);
            additionalMonths.push(previousMonth);
            monthsToUpdate.push(previousMonth);
        }

        console.log('additionalMonths', additionalMonths.map(item => [item.month + ' ' + item.id]));

        const accountToUpdate = account.updateHead(previousMonth, additionalMonths);

        yield* MonthUtils.save(monthsToUpdate);
        yield* AccountUtils.save(accountToUpdate);
        return accountToUpdate;
    }


    throw new Error('may be first');


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
