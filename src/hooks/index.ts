import { UUID } from '../models/common/common.types';
import { useAction, useAtom } from '@reatom/react';
import { AccountGrips } from '../atoms/account-grips/account-grips.atom';
import { DayDate, MonthDate } from '../models/common/date.types';
import { Months } from '../atoms/months/months.atom';
import { AccountMonthGrip } from '../models/account-grip/month-grip.class';
import { dayDateToMonth } from '../models/common/date.utils';
import { loadMonths } from '../atoms/months/months.actions';

export function useAccount(accountId: UUID) {
    return useAtom(
        AccountGrips,
        ({accounts}) => accounts.get(accountId),
        [accountId],
    );
}

export function useMonth(accountId: UUID, dayDate: MonthDate | DayDate) {
    const account = useAccount(accountId);
    const months = useAtom(Months);
    const loadMonth = useAction(loadMonths);

    const monthDate = dayDateToMonth(dayDate);

    if (!account)
        return null;

    const foundMonthBrief = account.account.months.find(item => item.month === monthDate);

    if (!foundMonthBrief)
        return null;

    const monthData = months.get(foundMonthBrief.id);
    if (!monthData) {
        loadMonth([foundMonthBrief.id]);
        return null;
    }

    return new AccountMonthGrip(monthData.summary.balanceOnStart, monthData, account.account, account.categories);
}

export function useTransaction(accountId: UUID, dayDate: DayDate, txId: UUID) {
    const month = useMonth(accountId, dayDate);

    if (!month)
        return null;

    const day = month.days.find(item => item.date === dayDate);
    if (!day)
        return null;

    console.log(day);
    return day.transactions.find(item => item.id === txId);
}
