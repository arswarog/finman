import { account } from './accounts';
import { transactions } from './transactions';
import { baseUrl } from './config';

export const paths = {
    account,
    transactions,
    home: () => `${baseUrl}/accounts`,
    licenses: () => `${baseUrl}/licenses`,
};
