import React, { useEffect, useState, Suspense } from 'react';
import styles from './App.module.scss';
import { Redirect, Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { NavBar } from './widgets/NavBar';
import { TransactionsPage } from './pages/TransactionsPage';
import { useAction, useAtom } from '@reatom/react';
import { Client } from './models/client/client.atom';
import { startListenOnlineStatus } from './models/client/client.service';
import { SubsetsPage } from './pages/SubsetsPage';
import { refreshAll } from './models/subsets/subsets.service';
import { AccountsPage } from './pages/AccountsPage';
import { TransactionAddPage } from './pages/TransactionAddPage';
import { loadAccounts } from './models/accounts/accounts.actions';
import { store } from './store/store';
import { useDBReady } from './store/db';
import './models/transaction/add.saga';

export const App = () => {
    const client = useAtom(Client);
    const refreshAllHandler = useAction(refreshAll);
    useDBReady(refreshAllHandler);

    return (
        <div className={styles.App}>
            <BrowserRouter>
                <Switch>
                    <Route path="/finman/transaction/add">
                        <TransactionAddPage/>
                    </Route>
                    <Route path="/finman/accounts">
                        <AccountsPage/>
                    </Route>
                    {/*<Route path="/finman/" exact={true}>*/}
                    {/*    <SubsetsPage/>*/}
                    {/*</Route>*/}
                    <Route path="/finman/transactions">
                        <TransactionsPage/>
                    </Route>
                    <Redirect to="/finman/accounts"/>
                </Switch>
                <main>
                </main>
                <NavBar/>
            </BrowserRouter>
        </div>
    );
};

startListenOnlineStatus(store);
store.dispatch(loadAccounts() as any);
