import { account } from './accounts';
import { transactions } from './transactions';
import { baseUrl } from './config';
import { categories } from './categories';

export const paths = {
    account,
    transactions,
    categories,
    home: () => `${baseUrl}/accounts`,
    licenses: () => `${baseUrl}/licenses`,
    menu: () => `${baseUrl}/menu`,
};
