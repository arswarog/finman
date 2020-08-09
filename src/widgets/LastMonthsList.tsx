import React from 'react';
import { MoneyView } from '../components/MoneyView';
import { IGrip } from '../models/abstract-grip/grip.types';
import { Link, paths } from '../routes';

interface IProps {
    grip: IGrip;
}

export const LastMonthsList = ({grip}: IProps) => {
    if (!grip)
        return (
            <div className="alert alert-outline-dark mt-2" role="alert">
                No data
            </div>
        )

    const months = grip.months.slice(1, 4);

    if (!months.length)
        return null;
        // return (
        //     <div className="alert alert-outline-dark mt-2" role="alert">
        //         No months found
        //     </div>
        // )

    return (
        <ul className="listview link-listview inset mt-2" style={{
            margin: '0',
        }}>
            {months.map(month => (
                <li>
                    <Link to={paths.account.month(grip.id, month.month)} className="item">
                        Balance on {month.month}
                        <span className="text"><MoneyView money={month.balanceOnEnd}/></span>
                    </Link>
                </li>
            ))}
        </ul>
    );
};
