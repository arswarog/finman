import React from 'react';
import { ITransactionForm } from '../../models/transaction/transaction.types';
import { store } from '../../store';
import {
    updateTransaction,
    updateTransactionFailed,
    updateTransactionSuccess,
} from '../../models/transaction/transaction.actions';
import { useHistory, useRouteMatch } from 'react-router';
import { Header } from '../../components/Header';
import { TransactionForm } from '../../widgets/TransactionForm';
import { Section } from '../../ui-kit/Section';
import { Card } from '../../ui-kit/Card';
import { Main } from '../../ui-kit/Main';
import { useAtom } from '../../store/reatom';
import { AccountGrips } from '../../atoms/account-grips/account-grips.atom';
import { Accounts } from '../../atoms/accounts/accounts.atom';
import { Icons } from '../../ui-kit/Icon';
import { HeaderAction } from '../../ui-kit/HeaderAction';
import { useTransaction } from '../../hooks';
import { UUID } from '../../models/common/common.types';
import { DayDate } from '../../models/common/date.types';
import { dispatchAndWaitResult } from '../../models/helper';
import { paths } from '../../routes';

interface IParams {
    accountId: UUID;
    date: DayDate;
    txId: UUID;
}

export const TransactionUpdatePage = () => {
    const {accountId, date, txId} = useRouteMatch<IParams>().params;

    const tx = useTransaction(accountId, date, txId);

    const history = useHistory();

    const {current: currentAccount} = useAtom(AccountGrips);
    const {accounts} = useAtom(Accounts);
    const categories = currentAccount ? Array.from(currentAccount.categories.values()) : [];

    if (!tx)
        return (
            <div>
                Loading
            </div>
        );

    const data: ITransactionForm = {
        id: tx.id,
        title: tx.title,
        type: tx.type,
        amount: tx.amount.amount,
        date: tx.date,
        account: tx.account.id,
        category: tx.category.id,
    };

    const submitHandler = (form: ITransactionForm) => {
        console.log(form);

        dispatchAndWaitResult(
            updateTransaction({
                ...form,
                account: currentAccount.id,
                lastTxData: data,
            }),
            updateTransactionSuccess,
            updateTransactionFailed,
        ).then(
            () => {
                history.goBack();
                setTimeout(() =>
                        history.replace(paths.transactions.view(
                            currentAccount.id,
                            form.date,
                            form.id,
                        )),
                    20,
                );
            },
            (data) => {
                alert(data.message);
                console.error(data);
            },
        );

    };

    const removeHandler = () => {
        alert('remove');
    };

    function validate(data: ITransactionForm) {
        const errors: Partial<{ [key in keyof ITransactionForm]: string }> = {};
        // if (!data.account)
        //     errors.account = 'Required';
        console.log(data);
        console.log(errors);
        return errors;
    }

    return (
        <>
            <Header back title="Update transaction">
                <HeaderAction onClick={removeHandler}
                              icon={Icons.trashOutline}/>
            </Header>
            <Main>
                <Section full>
                    <Card>
                        <TransactionForm value={data}
                                         onSubmit={submitHandler}
                                         validate={validate}
                                         accounts={Array.from(accounts.values())}
                                         categories={categories}
                        />
                    </Card>
                </Section>
            </Main>
        </>
    );
};
