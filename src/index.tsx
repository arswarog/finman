import React from 'react';
import ReactDOM from 'react-dom';
import { context } from '@reatom/react';
import './index.scss';
import { App } from './App';
import * as serviceWorker from './serviceWorker';
import { initDB } from './indexed-db';
import { store } from './store/store';

ReactDOM.render(
    <React.StrictMode>
        <context.Provider value={store}>
            <App/>
        </context.Provider>
    </React.StrictMode>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

initDB();
