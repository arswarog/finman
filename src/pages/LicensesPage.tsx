import React from 'react';
import styles from './LicensesPage.module.scss';
import { Header } from '../components/Header';
import { Main } from '../components/Main';
import { Section } from '../components/Section';
import { Card } from '../components/Card';

interface IProps {
    link: string;
    title: string;
    author: string;
    license: string;
}

const LicenseItem = ({title, link, author, license}: IProps) => (
    <li>
        <a href={link} target="_blank"
           className="item">
            {/*<img src="assets/img/sample/avatar/avatar1.jpg" alt="image" className="image"/>*/}
            <div className="in">
                <div>
                    <header>{author}</header>
                    {title}
                    <footer>{license}</footer>
                </div>
            </div>
        </a>
    </li>
);

export const LicensesPage = () => {

    return (
        <>
            <Header title="Licenses"/>
            <Main className={styles.licenses}>
                <ul className="listview link-listview inset mt-2">
                    <LicenseItem link="https://reactjs.org/"
                                 title="ReactJS"
                                 author="Facebook Open Source"
                                 license="MIT License"/>
                    <LicenseItem link="https://reatom.js.org/"
                                 title="Reatom state manager"
                                 author="Arutyunyan Artyom"
                                 license="MIT License"/>
                    <LicenseItem link="https://iconstore.co/icons/dripicons-v2/"
                                 title={'Icons "Dripicons" Version 2.0'}
                                 author="Amit Jakhu"
                                 license="CC BY 4.0"/>
                </ul>
            </Main>
        </>
    );
};
