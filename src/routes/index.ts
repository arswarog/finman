import { account } from './accounts';
import { transactions } from './transactions';
import { baseUrl } from './config';

export * from './Link';
export * from './routes';

export const paths = {
    account,
    transactions,
    home: () => `${baseUrl}/accounts`,
};
