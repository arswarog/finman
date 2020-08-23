import React, { ReactNode } from 'react';
import { Money } from '../models/money/money.class';
import { Icons } from '../ui-kit/Icon';
import { AccountGrip } from '../models/account-grip/grip.class';
import { BarColor, IQuickDetailsItem, IQuickDetailsItemProps, StatBox } from './StatBox';
import { IGrip } from '../models/abstract-grip/grip.types';
import { Main } from '../ui-kit/Main';

interface IProps {
    grip: AccountGrip;
}

export const GripQuickDetails = ({grip}: IProps) => {
    if (!grip)
        return (
            <div className="alert alert-warning mt-2" role="alert">
                Grip not specified
            </div>
        );

    const {income, expense, planed, total} = getQuickDetails(grip);

    const stats: ReactNode[][] = [
        [
            <StatBox title="Income"
                     icon={Icons.addCircleOutline}
                     {...income}
            />,
            <StatBox title="Expense"
                     icon={Icons.removeCircleOutline}
                     {...expense}
            />,
        ],
        [
            <StatBox title="Plan"
                     icon={Icons.calendarOutline}
                     {...planed}
            />,
            <StatBox title="Total"
                     icon={Icons.cashOutline}
                     {...total}
            />,
        ],
    ];

    return (
        <div className="section">
            {stats.map((row, index) => (
                <div key={index}
                     className="row mt-2 justify-content-center">
                    {row.map((cell, cellIndex) => (
                        <div key={cellIndex}
                             className="col-6">
                            {cell}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

function getQuickDetails(grip: IGrip): {
    income: IQuickDetailsItem,
    expense: IQuickDetailsItem,
    planed: IQuickDetailsItem,
    total: IQuickDetailsItem,
} {
    const month = grip.months[0];

    if (!month)
        return {
            income: {
                amount: null,
                progress: null,
                color: BarColor.Neutral,
            },
            expense: {
                amount: null,
                progress: null,
                color: BarColor.Neutral,
            },
            planed: {
                amount: Money.create(0, 'RUB'),
                progress: null,
                color: BarColor.Neutral,
            },
            total: {
                amount: null,
                progress: null,
                color: BarColor.Neutral,
            },
        };

    return {
        income: {
            amount: month.income,
            progress: null,
            color: BarColor.Neutral,
        },
        expense: {
            amount: month.expense,
            progress: null,
            color: BarColor.Neutral,
        },
        planed: {
            amount: Money.create(0, 'RUB'),
            progress: null,
            color: BarColor.Neutral,
        },
        total: {
            amount: month.balance,
            progress: null,
            color: BarColor.Neutral,
        },
    };
}
