import { Link } from '../routes';
import { IonIcon } from '@ionic/react';
import React from 'react';
import styles from './HeaderAction.module.scss';

interface IProps {
    link?: string;
    onClick?: () => void;
    icon?: string;
    title?: string;
}

export const HeaderAction = ({title, icon, link, onClick}: IProps) => {
    if (link)
        return (
            <Link to={link}
                  className={styles.headerAction}>
                <IonIcon mode="ios" icon={icon} className="icon" onClick={onClick}/>
            </Link>
        );
    else
        return (
            <div onClick={onClick}
                 className={styles.headerAction}>
                <IonIcon mode="ios" icon={icon} className="icon"/>
            </div>
        );
};
