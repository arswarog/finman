import Swipe, { SwipeItem } from 'swipejs/react';
import React, { Key, ReactElement } from 'react';
import styles from './SwipeWidget.module.scss';

interface IProps {
    showButtons?: boolean;
    current?: Key;

    onChange?: (key: Key) => void;

    children: ReactElement[];
}

export const SwipeWidget = ({showButtons, children, onChange, current}: IProps) => {
    let swipeEl: any;

    onChange = onChange || ((_) => null);

    const currentIndex = children.findIndex(item => item.key === current);

    const callback = (index) => {
        const current = children[index];
        onChange(current.key);
    };

    const prev = showButtons && currentIndex > 0 ? children[currentIndex - 1].key : '';
    const next = showButtons && currentIndex < children.length - 1 ? children[currentIndex + 1].key : '';

    const moveToPrev = () => {
        swipeEl.prev();
    };

    const moveToNext = () => {
        swipeEl.next();
    };

    return (
        <div className={styles.swipeWidget}>
            <Swipe ref={o => swipeEl = o}
                   className={styles.swipe}
                   callback={callback}
                   startSlide={currentIndex}
                   auto={false}>
                {children}
            </Swipe>
            {prev && <div className={styles.prev}
                          onClick={moveToPrev}>
                <svg width="24" height="24"
                     xmlns="http://www.w3.org/2000/svg"
                     fillRule="evenodd"
                     clipRule="evenodd">
                    <path d="M20 .755l-14.374 11.245 14.374 11.219-.619.781-15.381-12 15.391-12 .609.755z"/>
                </svg>
            </div>}
            {next && <div className={styles.next}
                          onClick={moveToNext}>
                <svg width="24" height="24"
                     xmlns="http://www.w3.org/2000/svg"
                     fillRule="evenodd"
                     clipRule="evenodd">
                    <path d="M4 .755l14.374 11.245-14.374 11.219.619.781 15.381-12-15.391-12-.609.755z"/>
                </svg>
            </div>}
        </div>
    );
};

export const SwipeItemWidget = ({children}) => {
    return (
        <SwipeItem className={styles.swipeItem}>
            {children}
        </SwipeItem>
    );
};
