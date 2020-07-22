import React from 'react';
import styles from './App.module.scss';
import { Redirect, Route, Switch } from 'react-router';
import { HashRouter } from 'react-router-dom';
import { NavBar } from './widgets/NavBar';
import { useAction } from '@reatom/react';
import { startListenOnlineStatus } from './atoms/client/client.service';
import { store } from './store/store';
import { initIndexedDB, useDBReady } from './db';
import './sagas';
import { sagaLauncher } from './sagas';
import { paths, routes } from './routes';
import { refresh } from './atoms/client/client.actions';

export const App = () => {
    const refreshAllHandler = useAction(() => {
        console.log('*** refreshAllHandler');

        initIndexedDB(store);

        console.log('*** refreshAllHandler complete');

        return refresh();
    }, []);
    useDBReady(refreshAllHandler);

    return (
        <div className={styles.App}>
            <HashRouter>
                <Switch>
                    {routes.map((route, index) => <Route {...route} key={index}/>)}
                    <Redirect to={paths.home()}/>
                </Switch>
                <NavBar/>
            </HashRouter>
        </div>
    );
};

startListenOnlineStatus(store);
sagaLauncher.start(store);
