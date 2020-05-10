import React, { useEffect, useState, Suspense } from 'react';
import logo from './logo.svg';
import './App.css';
import { useOnlineStatus } from '@21kb/react-online-status-hook/lib';

const Hello = React.lazy(() => import('./Hello'));

function App() {
    const [ip, setIp] = useState();
    const [hello, setHello] = useState();
    const online = useOnlineStatus();

    useEffect(() => {
        function getIP() {
            // console.log('get ip');
            // fetch('/manifest.json')
            // fetch('https://api.ipify.org?format=json')
            //     .then(
            //         response => response.json(),
            //     )
            //     .then(
            //         result => setIp(result.ip),
            //     );
            // fetch('/manifest.json')
            //     // fetch('https://api.ipify.org?format=json')
            //     .then(
            //         response => response.json(),
            //     )
            //     .then(
            //         result => {},//console.log(result),
            //     );
        }

        const timer = setInterval(() => getIP(), 1000);
        getIP();
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    IP: {ip}
                </p>
                <div>You are currently {online ? 'online' : 'offline'}.</div>
                <button className="App-link"
                        onClick={() => setHello(!hello)}
                >
                    Learn React
                </button>
                {hello &&
                <Suspense fallback={<div>Loading...</div>}>
                    <Hello/>
                </Suspense>}
            </header>
        </div>
    );
}

export default App;
