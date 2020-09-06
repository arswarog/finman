import { parse, ParseOptions, stringify, StringifyOptions } from 'query-string';

const defaultStringifyOptions: StringifyOptions = {skipNull: true, skipEmptyString: true};
const defaultParseOptions: ParseOptions = {};

export function addQueryString(query: { [key: string]: string | number },
                               options?: StringifyOptions): string {
    const queryString = stringify(query, {...defaultStringifyOptions, ...options});
    return queryString ? '?' + queryString : '';
}

export function parseQueryString<T extends object>(query: string,
                                                                      defaultValues?: {},
                                                                      options?: ParseOptions): T {
    return parse(query, {...defaultParseOptions, ...options}) as T;
}
