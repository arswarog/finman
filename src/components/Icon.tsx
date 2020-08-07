import { IonIcon } from '@ionic/react';
import React from 'react';
import * as IonIcons from 'ionicons';
import * as icons from 'ionicons/icons';

export const Icons = icons;

const IconRegistry = {
    'list-outline': icons.notificationsOutline,
    'menu-outline': icons.menuOutline,
    'close-circle': icons.closeCircle,
    'notifications-outline': icons.notificationsOutline,
    'chevron-back-outline': icons.chevronBackOutline,
};

IonIcons.addIcons(IconRegistry);

interface IProps {
    name: string;
    className?: string;
}

export const Icon = ({icon, name, className}: IProps & any) => {
    className = className || 'icon';
    if (!icon && name) {
        if (!IconRegistry[name])
            throw new Error(`Icon "${name}" not loaded`);
        icon = IconRegistry[name];
    }
    return <IonIcon mode="ios" icon={icon} className={className}/>;
};
