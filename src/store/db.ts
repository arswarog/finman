import { DBStatus, IndexedDB } from '../indexed-db';
import { useEffect, useState } from 'react';
import { SubsetScheme } from '../models/subset/subset.scheme';

export const db = new IndexedDB('test', [
    SubsetScheme,
]);

export function useDBReady(onReady: () => void) {
    const [status, setStatus] = useState(db.status);

    const onChangeStatusEvent = (status: DBStatus) => {
        console.log(DBStatus[status]);
        if (status === DBStatus.Ready)
            onReady();
        setStatus(status);
    };

    useEffect(() => {
        db.addStatusListener(onChangeStatusEvent);
        return () => db.removeStatusListener(onChangeStatusEvent);
    });
}
