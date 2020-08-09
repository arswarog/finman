export const baseUrl = '';

export function addQueryString(params: {[key:string]: any}): string {
    if (!params)
        return '';
    if (!Object.keys(params).length)
        return '';

    return '?' + new URLSearchParams(params).toString();
}
