import { addTransactionSaga } from './transaction-add.saga';
import { addTransaction } from '../../models/transaction/transaction.actions';
import { TransactionType } from '../../models/transaction/transaction.types';
import { AccountDTO } from '../../models/account-dto/account.class';
import { MonthLegacy } from '../../models/month/month-legacy.class';
import { AccountUtils } from '../utils/account.saga';
import { expectCallEffect } from '../helpers/helpers.spec';
import { MonthUtils } from '../utils/month.saga';
import { Money } from '../../models/money/money.class';
import { Day } from '../../models/day/day.class';
import { Transaction } from '../../models/transaction/transaction.class';
import { isVersionOfMonth } from '../../models/account-dto/chain.utils';

describe('addTransactionSaga', () => {
    const baseAccount = AccountDTO.create('test');

    it('add first tx', () => {
        const gen = addTransactionSaga(addTransaction({
            account: 'test',
            amount: '123',
            date: '2020-06-12',
            category: '',
            title: '',
            type: TransactionType.Income,
        }));

        // step 1: get account
        const r1 = gen.next();
        expect(r1.done).toBeFalsy();
        expectCallEffect(r1.value, AccountUtils.select);
        expect(r1.value.payload.args).toEqual(['test']);

        // step 2: get month
        const r2 = gen.next(baseAccount);
        expect(r2.done).toBeFalsy();
        expectCallEffect(r2.value, MonthUtils.get);
        expect(r2.value.payload.args).toEqual([baseAccount, '2020-06']);

        const month = MonthLegacy.createFirstBlock(baseAccount.id, '2020-06', 1592933974065);

        // step 3: update account and month
        const r3 = gen.next(month);
        expect(r3.done).toBeFalsy();
        expectCallEffect(r3.value, AccountUtils.update);
        expect(r3.value.payload.args[0]).toEqual(baseAccount);

        const account = baseAccount.updateHead(r3.value.payload.args[1]);
        expect(account.balance.toString()).toBe(Money.create(123, 'RUB').toString());

        // step 4: complete
        const r4 = gen.next(account);
        expect(r4.done).toBeTruthy();
        expect(r4.value).toEqual(account);
    });
    it('add tx to exists month', () => {
        // arrange
        const baseMonth = MonthLegacy.createFirstBlock(baseAccount.id, '2020-06', 1593035174796);
        const existsMonth = baseMonth.updateDay(
            Day.create('2020-06-10')
               .addTransaction(
                   Transaction.create(TransactionType.Expense, 100, 'RUB'),
               ),
        );

        expect(existsMonth.id).not.toBe(baseMonth.id);
        expect(existsMonth.prevVersions).toEqual([baseMonth.id]);

        console.log('existsMonth', existsMonth.id);

        const account = baseAccount.updateHead(existsMonth);

        // act
        const gen = addTransactionSaga(addTransaction({
            account: 'test',
            amount: '123',
            date: '2020-06-12',
            category: '0000-111',
            title: '',
            type: TransactionType.Income,
        }));

        // step 1: get account
        const r1 = gen.next();
        expect(r1.done).toBeFalsy();
        expectCallEffect(r1.value, AccountUtils.select);
        expect(r1.value.payload.args).toEqual(['test']);
        expect(account.months[0].id).toBe(existsMonth.id);

        // step 2: get month
        const r2 = gen.next(account);
        expect(r2.done).toBeFalsy();
        expectCallEffect(r2.value, MonthUtils.get, account, '2020-06');

        // step 3: update account and month
        const r3 = gen.next(existsMonth);
        expect(r3.done).toBeFalsy();
        const [r3account, r3month] = expectCallEffect(r3.value, AccountUtils.update);
        expect(r3account).toEqual(account);
        expect(r3month.id).not.toBe(existsMonth.id);
        expect(r3month.prevVersions).toEqual([baseMonth.id]);

        console.log(baseMonth.id)
        expect(isVersionOfMonth(r3month, existsMonth, [baseMonth])).toBeTruthy()
        const acc = account.updateHead(r3month, [baseMonth]);
        expect(acc.balance.toString()).toBe(Money.create(23, 'RUB').toString());

        // step 4: complete
        const r4 = gen.next(acc);
        expect(r4.done).toBeTruthy();
        expect(r4.value).toEqual(acc);
    });
});
