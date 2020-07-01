import React from 'react';
import styles from './App.module.scss';
import { Redirect, Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { NavBar } from './widgets/NavBar';
import { useAction, useAtom } from '@reatom/react';
import { Client } from './atoms/client/client.atom';
import { startListenOnlineStatus } from './atoms/client/client.service';
import { store } from './store/store';
import { initIndexedDB, useDBReady } from './store/db';
import './sagas';
import { sagaLauncher } from './sagas';
import { paths, routes } from './routes';
import { refresh } from './atoms/client/client.actions';

export const App = () => {
    const client = useAtom(Client);
    const refreshAllHandler = useAction(() => {
        console.log('*** refreshAllHandler');

        initIndexedDB(store);

        console.log('*** refreshAllHandler complete');

        return refresh();
    }, []);
    useDBReady(refreshAllHandler);

    return (
        <div className={styles.App}>
            <BrowserRouter>
                <Switch>
                    {routes.map(route => <Route {...route}/>)}
                    <Redirect to={paths.home()}/>
                </Switch>
                <NavBar/>
            </BrowserRouter>
        </div>
    );
};

startListenOnlineStatus(store);
sagaLauncher.start(store);
