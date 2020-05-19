import React from 'react';
import { Link } from 'react-router-dom';

export const NavBar = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/finman/">Home</Link>
                </li>
                <li>
                    <Link to="/finman/transactions">Transactions</Link>
                </li>
            </ul>
        </nav>
    );
};
