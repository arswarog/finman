import { DBStatus } from '../libs/indexed-db';
import { useEffect } from 'react';
import { db } from './db';

export function useDBReady(onReady: () => void) {
    console.log('useDBReady');

    const onChangeStatusEvent = (status: DBStatus) => {
        console.log(DBStatus[status]);
        if (status === DBStatus.Ready)
            onReady();
    };

    useEffect(() => {
        db.addStatusListener(onChangeStatusEvent);
        return () => db.removeStatusListener(onChangeStatusEvent);
    });
}
