import { addActionHandler, db } from '../db';
import {
    loadMonths,
    loadMonthsFailed,
    loadMonthsSuccess,
    saveMonths, saveMonthsFailed,
    saveMonthsSuccess,
} from '../../atoms/months/months.actions';
import { MonthScheme } from '../schemes';
import { Month } from '../../models/month/month-legacy.class';

addActionHandler(loadMonths, (ids, store) => {
    db.transaction(MonthScheme)
      .getAll(ids).then(
        result => {
            console.log(ids);
            console.log(result);
            const months = result.map(Month.fromJSON);
            store.dispatch(loadMonthsSuccess(months));
        },
        error => store.dispatch(loadMonthsFailed({ids, error})),
    );
});

addActionHandler(saveMonths, (months, store) => {
    const ids = months.map(item => item.id);
    const tx = db.transaction(MonthScheme);
    Promise.all(months.map(month => tx.update(month.toJSON())))
           .then(
               () => store.dispatch(saveMonthsSuccess(ids)),
               error => store.dispatch(saveMonthsFailed({ids, error})),
           );
});
