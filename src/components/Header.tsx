import React, { ReactNode, useCallback } from 'react';

import { Icon } from '../ui-kit/Icon';
import { useHistory } from 'react-router';

interface IParams {
    title: string;
    back?: string | boolean;
    children?: ReactNode;
}

export const Header = ({title, back, children}: IParams) => {
    const history = useHistory();

    const onClick = useCallback(() => {
        if (!back)
            return;
        if (back === true)
            return history.goBack();
        history.replace(back);
    }, [history, back]);

    return (
        <div className="appHeader">
            {back &&
            <div className="left">
                <span onClick={onClick} className="headerButton goBack">
                    <Icon name="chevron-back-outline" role="img" className="md hydrated"
                          aria-label="chevron back outline"/>
                </span>
            </div>
            }
            <div className="pageTitle">{title}</div>
            <div className="right">
                {children}
            </div>
        </div>
    );
};
