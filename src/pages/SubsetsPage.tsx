import React from 'react';
import { upgrade } from '../indexed-db';
import { Subsets } from '../atoms/subsets/subsets.atom';
import { useAction, useAtom } from '@reatom/react';
import { MoneyView } from '../components/MoneyView';

import styles from './SubsetsPage.module.scss';
import { chooseSubset } from '../atoms/subsets/subsets.actions';

export const SubsetsPage = () => {
    const subsets = useAtom(Subsets);
    const chooseSubsetHandler = useAction(chooseSubset);

    return (
        <div>
            Страница с информацией об одном или нескольких аккаунтов
            <button onClick={upgrade}>upgrade</button>

            {
                subsets.all.map(item => (
                    <div className={item === subsets.current ? styles.currentSubset : ''}
                         key={item.id}
                         onClick={() => chooseSubsetHandler(item.id)}>
                        <h3>{item.name}</h3>
                        {/*<h4>{item.balance}</h4>*/}
                        <h4><MoneyView money={item.balance}/></h4>
                    </div>
                ))
            }
        </div>
    );
};
