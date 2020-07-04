import { MonthDate } from '../common/date.types';
import format from 'date-fns/format';

export function getMonthName(month?: MonthDate): string {
    if (month)
        return format(new Date(month), 'MMMM');
    else
        return 'месяц';
}
