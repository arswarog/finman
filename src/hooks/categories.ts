import { Map } from 'immutable';
import { ICategory } from '../models/category/category.types';
import { UUID } from '../models/common/common.types';
import { useCurrentAccount } from './accounts';

export function useCategories(accountId?: UUID) {
    const account = useCurrentAccount();

    console.log(account);

    return account
        ? account.categories
        : Map<UUID, ICategory>();
}
