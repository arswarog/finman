/**
 * This comment will be used as the summary for the "thing2" module.
 *
 * @packageDocumentation
 * @module app-root
 * @preferred
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { context } from '@reatom/react';
import './styles/index.scss';
import { App } from './App';
import * as serviceWorker from './serviceWorker';
import { store } from './store';

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
serviceWorker.unregister();
