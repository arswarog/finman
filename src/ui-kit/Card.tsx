import React, { ReactNode } from 'react';

interface IProps {
    full?: boolean;
    children: ReactNode;
}

export const Card = ({full, children}: IProps) => (
    <div className={['card', 'mt-1', full ? 'full' : ''].join(' ')}>
        <div className="card-body">
            {children}
        </div>
    </div>
);
