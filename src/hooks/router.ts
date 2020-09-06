import { useLocation } from 'react-router';
import { parseQueryString } from '../routes/helper';

export function useQueryParams<T extends object>(): T {
    const query = parseQueryString<T>(useLocation().search);
    return query;
}
