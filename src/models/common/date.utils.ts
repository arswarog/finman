import { DayDate, MonthDate } from './date.types';

export function parseMonthDate(value: MonthDate): Date {
    const match: RegExpMatchArray | null = value.match(/^(\d{4})-(\d{2})$/);
    if (!match)
        throw new Error(`Invalid MonthDate "${value}"`);

    const year = +match[1];
    const month = +match[2] - 1;
    const date = new Date(year, month, 1, 12, 0, 0);

    if (date.getFullYear() !== year)
        throw new Error(`Invalid year in "${value}"`);
    if (date.getMonth() !== month)
        throw new Error(`Invalid month in "${value}"`);

    return date;
}

export function parseDayDate(value: DayDate): Date {
    const match: RegExpMatchArray | null = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match)
        throw new Error(`Invalid DayDate "${value}"`);

    const year = +match[1];
    const month = +match[2] - 1;
    const day = +match[3];
    const date = new Date(year, month, day, 12, 0, 0);

    if (date.getFullYear() !== year)
        throw new Error(`Invalid year in "${value}"`);
    if (date.getMonth() !== month)
        throw new Error(`Invalid month in "${value}"`);
    if (date.getDate() !== day)
        throw new Error(`Invalid date in "${value}"`);

    return date;
}

export function getDayFromDayDate(date: DayDate): number {
    const match: RegExpMatchArray | null = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match)
        throw new Error(`Invalid DayDate "${date}"`);

    return +match[3];
}

export function dayDateToMonth(day: DayDate): MonthDate {
    return day.split('-', 2).join('-');
}
