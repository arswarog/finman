import React, { ReactNode } from 'react';
import { Header } from '../components/Header';
import { Link } from '../routes';
import { Icon } from '../ui-kit/Icon';
import { Main } from '../ui-kit/Main';

interface IProps {
    title: string;
    children?: ReactNode;
}

export const ErrorPage = ({title, children}: IProps) => {
    return (
        <>
            <Header title={title} back/>
            <Main>
                {children}
            </Main>
        </>
    );
};
