export const baseUrl = '';

export function addQueryString(params: Record<string, string>): string {
    if (!params)
        return '';
    if (!Object.keys(params).length)
        return '';

    return '?' + new URLSearchParams(params).toString();
}
