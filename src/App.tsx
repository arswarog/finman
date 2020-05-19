import React, { useEffect, useState, Suspense } from 'react';
import styles from './App.module.scss';
import { useOnlineStatus } from '@21kb/react-online-status-hook/lib';
import { Redirect, Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { TransactionsPage } from './pages/TransactionsPage';

const Hello = React.lazy(() => import('./Hello'));

function App() {
    const [ip, setIp] = useState();
    const [hello, setHello] = useState();
    const online = useOnlineStatus();

    return (
        <div className={styles.App}>
            <BrowserRouter>
                <Switch>
                    <Route path="/transactions">
                        <TransactionsPage/>
                    </Route>
                    <Redirect to="/transactions"/>
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
}

export default App;
