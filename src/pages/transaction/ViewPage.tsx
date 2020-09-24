import React, { useCallback } from 'react';
import { ITransactionGrip } from '../../models/abstract-grip/grip.types';
import { Header } from '../../components/Header';
import { Icon, Icons } from '../../ui-kit/Icon';
import { Main } from '../../ui-kit/Main';
import { UUID } from '../../models/common/common.types';
import { DayDate } from '../../models/common/date.types';
import { useRouteMatch } from 'react-router';
import { useAccount, useMonth, useTransaction } from '../../hooks';
import { TransactionType } from '../../models/transaction/transaction.types';
import { MoneyView } from '../../components/MoneyView';
import { Link, paths } from '../../routes';
import { HeaderAction } from '../../ui-kit/HeaderAction';

interface IParams {
    accountId: UUID;
    date: DayDate;
    txId: UUID;
}

export const TransactionViewPage = () => {
    const {accountId, date, txId} = useRouteMatch<IParams>().params;

    const tx = useTransaction(accountId, date, txId);

    if (!tx)
        return (
            <div>
                Not found
            </div>
        );

    return (
        <>
            <Header title="Transaction details" back>
                <HeaderAction link={paths.transactions.update(tx.account.id, tx.date, tx.id)}
                              icon={Icons.settingsOutline}/>
            </Header>
            <Main>
                <div className="section mt-2 mb-2">
                    <div className="card inner" style={{padding: 16}}>
                        <div className="listed-detail mt-3">
                            <div className="icon-wrapper">
                                <div className="iconbox">
                                    <Icon icon={Icons.arrowForwardOutline} role="img" className="md hydrated"/>
                                </div>
                            </div>
                            <h3 className="text-center mt-2">{TransactionType[tx.type]}</h3>
                        </div>

                        <ul className="listview flush transparent simple-listview no-space mt-3">
                            <li>
                                <strong>Amount</strong>
                                <span><MoneyView money={tx.amount}/></span>
                            </li>
                            <li>
                                <strong>Category</strong>
                                <Link to={paths.categories.view('', tx.category.id)}>{tx.category.name}</Link>
                            </li>
                            <li>
                                <strong>Title</strong>
                                <span>{tx.title || 'No title'}</span>
                            </li>
                            <li>
                                <strong>Tags</strong>
                                <span>{tx.tags.join(', ') || 'No tags'}</span>
                            </li>
                            <li>
                                <strong>Wallet</strong>
                                <span><Link to={paths.account.view(tx.account.id)}>{tx.account.name}</Link></span>
                            </li>
                            <li>
                                <strong>Date</strong>
                                <span>{tx.date}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </Main>
        </>
    );
};
