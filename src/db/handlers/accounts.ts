import { addActionHandler, db } from '../db';
import {
    chooseAccount,
    loadAccounts,
    loadAccountsFailed,
    loadAccountsSuccess, saveAccount, saveAccountFailed, saveAccountSuccess,
} from '../../atoms/accounts/accounts.actions';
import { AccountScheme } from '../schemes';
import { Account } from '../../models/account/account.class';
import { loadCategories } from '../../atoms/categories/categories.actions';

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

            const accounts = result.map(Account.fromJSON);

            store.dispatch(loadAccountsSuccess({
                current: localStorage.getItem(CURRENT_ACCOUNT_KEY),
                accounts,
            }));

            const ids = new Set(accounts.map(item => item.categoriesBlockId));
            ids.forEach(categoriesBlockId => {
                if (categoriesBlockId)
                    store.dispatch(loadCategories(categoriesBlockId));
            });
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
