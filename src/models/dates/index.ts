import { DayDate, MonthDate } from '../common/date.types';
import format from 'date-fns/format';

export function getMonthName(month?: MonthDate): string {
    if (month)
        return format(new Date(month), 'MMMM');
    else
        return 'month';
}

export function getDayDate(date: Date = new Date()): DayDate {
    return date.getFullYear()
        + '-'
        + (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1)
        + '-'
        + (date.getDate() <= 9 ? '0' : '') + date.getDate();
}
