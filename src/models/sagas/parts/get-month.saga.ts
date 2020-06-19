import { MonthDate } from '../../common/date.types';
import { Account } from '../../account/account.class';
import { Month } from '../../month/month.class';
import { getMonthsByIds, getMonthsByIdsSaga, getTimestamp } from '../helpers';
import { put } from 'redux-saga/effects';

export function* getMonthSaga(account: Account, monthDate: MonthDate) {
    if (!account.head) {
        const timestamp: number = yield getTimestamp();
        console.log('timestamp', timestamp);
        return Month.createFirstBlock(account.id, monthDate, timestamp);
    }

    if (monthDate > account.head.month) { // create next block
        const [head]: Month[] = yield getMonthsByIds([account.head.id]);
        const timestamp: number = yield getTimestamp();
        return head.createNextBlock(monthDate, timestamp);
    }

    const indexOfMonth = account.months.findIndex(item => item.month === monthDate);
    if (indexOfMonth > -1) {
        const monthsIds = account.months
                                 .slice(0, indexOfMonth + 1)
                                 .map(item => item.id);
        const months = yield getMonthsByIds(monthsIds);
        return months.pop();
    }

    return null;
}
