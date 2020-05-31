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
import { useDBReady, store } from './store';
import { Account, RequiredMonthsError } from './models/account/account.class';

const Hello = React.lazy(() => import('./Hello'));

export const App = () => {
    const [hello, setHello] = useState();
    const client = useAtom(Client);
    const refreshAllHandler = useAction(refreshAll);
    useDBReady(refreshAllHandler);

    return (
        <div className={styles.App}>
            <BrowserRouter>
                <Switch>
                    <Route path="/finman/" exact={true}>
                        <SubsetsPage/>
                    </Route>
                    <Route path="/finman/transactions">
                        <TransactionsPage/>
                    </Route>
                    <Redirect to="/finman/"/>
                </Switch>
                <main>
                    {hello &&
                    <Suspense fallback={<div>Loading...</div>}>
                        <Hello/>
                    </Suspense>}
                </main>
                <NavBar/>
            </BrowserRouter>
        </div>
    );
};

startListenOnlineStatus(store);
