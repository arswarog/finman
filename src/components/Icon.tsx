import { IonIcon } from '@ionic/react';
import React from 'react';
import * as IonIcons from 'ionicons';
import * as Icons from 'ionicons/icons';

const IconRegistry = {
    'list-outline': Icons.notificationsOutline,
    'menu-outline': Icons.menuOutline,
    'close-circle': Icons.closeCircle,
    'notifications-outline': Icons.notificationsOutline,
};

IonIcons.addIcons(IconRegistry);

interface IProps {
    name: string;
    className?: string;
}

export const Icon = ({name, className}: IProps & any) => {
    className = className || 'icon';
    if (!IconRegistry[name])
        throw new Error(`Icon "${name}" not loaded`);
    return <IonIcon mode="ios" name={name} className={className}/>;
};
