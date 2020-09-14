import { addActionHandler, db } from '../db';
import {
    chooseAccount,
    loadAccounts,
    loadAccountsFailed,
    loadAccountsSuccess, saveAccount, saveAccountFailed, saveAccountSuccess,
} from '../../atoms/accounts/accounts.actions';
import { AccountScheme } from '../schemes';
import { AccountDTO } from '../../models/account-dto/account.class';
import { loadCategories } from '../../atoms/categories/categories.actions';
import { chooseAccountGrip } from '../../atoms/account-grips/account-grips.actions';

const CURRENT_ACCOUNT_KEY = 'currentAccount';

addActionHandler(chooseAccount, payload => {
    localStorage.setItem(CURRENT_ACCOUNT_KEY, payload);
});

addActionHandler(loadAccounts, (_, store) => {
    db.transaction(AccountScheme)
      .getAll().then(
        result => {
            if (!result.length)
                return console.warn('No accounts exists');

            const accounts = result.map(AccountDTO.fromJSON);

            const currentID = localStorage.getItem(CURRENT_ACCOUNT_KEY);

            store.dispatch(loadAccountsSuccess({
                accounts,
            }));

            store.dispatch(chooseAccountGrip(currentID));
        },
        error => store.dispatch(loadAccountsFailed(error)),
    );
});

addActionHandler(saveAccount, (account, store) => {
    db.transaction(AccountScheme)
      .update(account.toJSON() as any).then(
        result => store.dispatch(saveAccountSuccess(account.id)),
        error => store.dispatch(saveAccountFailed({id: account.id, error})),
    );
});
