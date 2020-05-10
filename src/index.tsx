import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();


// This is what our customer data looks like.
const customerData = [
    {ssn: '444-44-4444', name: 'Bill', age: 35, email: 'bill@company.com'},
    {ssn: '555-55-5555', name: 'Donna', age: 32, email: 'donna@home.org'},
];
const dbName = 'the_name';

const request = indexedDB.open(dbName, 2);

request.onerror = function (event) {
    // Handle errors.
};
request.onsuccess = function (event: any) {
    const db = event.target.result;
    (window as any).db = db;

    const transaction = db.transaction(['customers'], 'readwrite');
    const objectStore = transaction.objectStore('customers');
    const r = objectStore.add({age: 44, email: 'asd', name: 'asd', ssn: '123'});
    r.onsuccess = (event) => console.log(event);
};
request.onupgradeneeded = function (event: any) {
    const db = event.target.result;

    // Create an objectStore to hold information about our customers. We're
    // going to use "ssn" as our key path because it's guaranteed to be
    // unique.
    const objectStore = db.createObjectStore('customers', {keyPath: 'ssn'});

    // Create an index to search customers by name. We may have duplicates
    // so we can't use a unique index.
    objectStore.createIndex('name', 'name', {unique: false});

    // Create an index to search customers by email. We want to ensure that
    // no two customers have the same email, so use a unique index.
    objectStore.createIndex('email', 'email', {unique: true});

    // Store values in the newly created objectStore.
    for (let i in customerData) {
        objectStore.add(customerData[i]);
    }
};




