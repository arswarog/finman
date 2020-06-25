import { Month } from '../../models/month/month.class';
import { Account } from '../../models/account/account.class';
import { Helpers } from '../helpers';
import { UUID } from '../../models/common/common.types';
import { SagaPacker } from '../saga-launcher';
import { Accounts, IAccountsState } from '../../atoms/accounts/accounts.atom';
import { select, put, take } from 'redux-saga/effects';
import { saveAccount, saveAccountSuccess, saveAccountFailed } from '../../atoms/accounts/accounts.actions';
import { MonthUtils } from './month.saga';

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
    // for (let countdown = 10; countdown; countdown--) {
    //     try {
    console.log(account.months.map(item => item.month));
    let currentMonthIndex = account.months.findIndex(item => item.month === month.month);
    let prevMonthIndex = account.months.findIndex(item => item.month < month.month);

    let toIndex = currentMonthIndex === -1
        ? prevMonthIndex
        : currentMonthIndex;

    const monthsIds: UUID[] = account.months
                                     .slice(0, toIndex + 1)
                                     .map(item => item.id);

    console.log({
        currentMonthIndex,
        prevMonthIndex,
        toIndex,
        months: account.months
                       .slice(0, toIndex + 1)
                       .map(item => item.month),
    });


    let {accountToUpdate, monthsToUpdate} = updateAccount(account, month, [month]);
    yield* MonthUtils.save(monthsToUpdate);
    yield* AccountUtils.save(accountToUpdate);
    return accountToUpdate;
    // } catch (error) {
    //     console.log(error);
    // }
    // }
    // throw new Error('Something wrongs. To many tries');
}

export function updateAccount(account: Account, month: Month, additionalMonths: Month[]): {
    accountToUpdate: Account,
    monthsToUpdate: Month[],
} {
    const accountToUpdate = account.updateHead(month);
    console.log(accountToUpdate.months);
    return {
        accountToUpdate,
        monthsToUpdate: [month],
    };

    throw new Error('Not implements');
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
