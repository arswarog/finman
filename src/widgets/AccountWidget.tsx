import React from 'react';
import { useHistory } from 'react-router';
import { paths } from '../routes';
import { Icon, Icons } from '../ui-kit/Icon';
import { MoneyView } from '../components/MoneyView';
import styles from './AccountWidget.module.scss';
import { AccountGrip } from '../models/account-grip/grip.class';

interface IProps {
    account: AccountGrip;
}

export const AccountWidget = ({account}: IProps) => {
    const history = useHistory();

    function addTx() {
        history.push(paths.transactions.add({account: account.id}));
    }

    return (
        <div className="card-block bg-primary">
            <div className="card-main">
                <div className="card-button dropdown">
                    <button type="button" className="btn btn-link btn-icon" data-toggle="dropdown">
                        <Icon icon={Icons.cogOutline} role="img" className="md hydrated"
                              aria-label="ellipsis horizontal"/>
                    </button>
                    <div className="dropdown-menu dropdown-menu-right">
                        <a className="dropdown-item" href="javacript:;">
                            <Icon icon={Icons.pencilOutline} role="img" className="md hydrated"
                                  aria-label="pencil outline"/>
                            Edit
                        </a>
                        <a className="dropdown-item" href="javacript:;">
                            <Icon icon={Icons.closeOutline} role="img" className="md hydrated"
                                  aria-label="close outline"/>
                            Remove
                        </a>
                        <a className="dropdown-item" href="javacript:;">
                            <Icon icon={Icons.arrowUpCircleOutline} role="img" className="md hydrated"
                                  aria-label="arrow up circle outline"/>
                            Upgrade
                        </a>
                    </div>
                </div>
                <div className="balance">
                    <span className="label">BALANCE</span>
                    <h1 className="title"><MoneyView money={account.balance}/></h1>
                </div>
                <div className="in">
                    <div className="card-number">
                        <span className="label">Account name</span>
                        {account.name}
                    </div>
                    {/*<div className="card-number">*/}
                    {/*    <span className="label">Card Number</span>*/}
                    {/*    •••• •••• •••• 9905*/}
                    {/*</div>*/}
                    <div className="bottom">
                        <div className="card-expiry">
                            <span className="label">Statistics for</span>
                            Last month
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
