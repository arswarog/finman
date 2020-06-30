import React, { useEffect, useState, Suspense } from 'react';
import styles from './App.module.scss';
import { Redirect, Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { NavBar } from './widgets/NavBar';
import { TransactionsPage } from './pages/TransactionsPage';
import { useAction, useAtom } from '@reatom/react';
import { Client } from './atoms/client/client.atom';
import { startListenOnlineStatus } from './atoms/client/client.service';
import { SubsetsPage } from './pages/SubsetsPage';
import { refreshAll } from './atoms/subsets/subsets.service';
import { AccountsPage } from './pages/AccountsPage';
import { TransactionAddPage } from './pages/TransactionAddPage';
import { loadAccounts } from './atoms/accounts/accounts.actions';
import { store } from './store/store';
import { useDBReady } from './store/db';
import './sagas';
import { sagaLauncher } from './sagas';
import { AccountMonthsPage } from './pages/AccountMonthsPage';
import { AccountPage } from './pages/AccountPage';
import { paths, routes } from './routes';

export const App = () => {
    const client = useAtom(Client);
    const refreshAllHandler = useAction(refreshAll);
    useDBReady(refreshAllHandler);

    return (
        <div className={styles.App}>
            <BrowserRouter>
                <main>
                    <Switch>
                        {routes.map(route => <Route {...route}/>)}
                        <Redirect to={paths.home()}/>
                    </Switch>
                </main>
                <NavBar/>
            </BrowserRouter>
        </div>
    );
};

startListenOnlineStatus(store);
store.dispatch(loadAccounts());
sagaLauncher.start(store);
