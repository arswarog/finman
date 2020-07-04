import React, { ReactElement, ReactNode, memo } from 'react';
import styles from './DetailsMainButton.module.scss';
import { Link } from '../routes';
import { MoneyView } from './MoneyView';
import { Money } from '../models/money/money.class';

export enum BarColor {
    Neutral = 'neutral',
    Good = 'good',
    Normal = 'normal',
    Bad = 'bad',
}

const MORE_MIN_K = 1.1;
const LESS_MAX_K = 0.9;

export type IDetailsMainButton = IDetailsMainButtonBase
    | IDetailsMainButtonBase & (
    IDetailsMainButtonMoreIsBetter |
    IDetailsMainButtonLessIsBetter
    );

export interface IDetailsMainButtonBase {
    title: string;
    amount: Money;
    link?: string;
}

// export interface IDetailsMainButtonColor {
//     color: BarColor;
// }

export interface IDetailsMainButtonMoreIsBetter {
    percent: number;
    moreIsBetter: true;
}

export interface IDetailsMainButtonLessIsBetter {
    percent: number;
    lessIsBetter: true;
}

const Button = (props: IDetailsMainButton) => {
    const {title, link, amount} = props;

    let barWidth = 100;
    let barColor = BarColor.Good;
    let barBgColor = BarColor.Neutral;
    let percentDiff = '';
    if ('percent' in props)
        ({barWidth, barColor, barBgColor, percentDiff} = prepareButtonData(props));

    return (
        <Link className={styles.button} to={link}>
            <div className={styles.left}>
                <div className={styles.title}>
                    {title}
                    <em>{percentDiff}</em>
                </div>
                <div className={styles.bar}
                     style={{
                         backgroundColor: barColorToColor(barBgColor),
                     }}>
                    <div style={{
                        width: barWidth + '%',
                        backgroundColor: barColorToColor(barColor),
                    }}/>
                </div>
            </div>
            <div className={styles.right}>
                <MoneyView money={amount}/>
            </div>
        </Link>
    );
};

interface IListProps {
    children: ReactNode[];
    cover?: boolean;
}

const List = ({children, cover}: IListProps) => {
    const items = children.flat() as ReactElement[];
    return <div className={[styles.list, cover && styles.list_cover].join(' ')}>
        {items}
    </div>;
};

export const DetailsMain = {
    Button: memo(Button),
    List: memo(List),
};

interface IPreparedButtonData {
    percentDiff: string;
    barBgColor: BarColor;
    barColor: BarColor;
    barWidth: number;
}

export function prepareButtonData(props: IDetailsMainButtonMoreIsBetter | IDetailsMainButtonLessIsBetter): IPreparedButtonData {
    const percent = props.percent;

    const percentDiff = percent <= 0.99
        ? Math.ceil(percent * 100 - 100) + '%'
        : percent >= 1.01
            ? ('+' + Math.floor(percent * 100 - 100) + '%')
            : '+0%';

    const barWidth = percent <= 1
        ? Math.ceil(percent * 100)
        : Math.floor((1 / percent) * 100);

    if ('moreIsBetter' in props && props.moreIsBetter) {
        if (percent >= MORE_MIN_K)
            return {
                percentDiff,
                barBgColor: BarColor.Good,
                barColor: BarColor.Normal,
                barWidth,
            };
        if (percent <= LESS_MAX_K)
            return {
                percentDiff,
                barBgColor: BarColor.Neutral,
                barColor: BarColor.Bad,
                barWidth,
            };
        return {
            percentDiff,
            barBgColor: BarColor.Good,
            barColor: BarColor.Normal,
            barWidth,
        };
    }
    if ('lessIsBetter' in props && props.lessIsBetter) {
        if (percent >= MORE_MIN_K)
            return {
                percentDiff,
                barBgColor: BarColor.Normal,
                barColor: BarColor.Bad,
                barWidth,
            };
        if (percent <= LESS_MAX_K)
            return {
                percentDiff,
                barBgColor: BarColor.Neutral,
                barColor: BarColor.Good,
                barWidth,
            };
        return {
            percentDiff,
            barBgColor: BarColor.Neutral,
            barColor: BarColor.Normal,
            barWidth,
        };
    }

    throw new Error('Must be moreIsBetter or lessIsBetter');
}

function barColorToColor(barColor: BarColor): string {
    switch (barColor) {
        case BarColor.Good:
            return 'yellowgreen';
        case BarColor.Normal:
            return 'yellow';
        case BarColor.Bad:
            return 'red';
        case BarColor.Neutral:
        default:
            return '#d0d0d0';
    }
}
