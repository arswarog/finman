import { Month } from '../../models/month/month.class';
import { Account } from '../../models/account/account.class';
import { AccountUtils } from './account.saga';
import { CallEffect } from 'redux-saga/effects';
import { SyncStatus } from '../../models/month/month.types';
import { Transaction } from '../../models/transaction/transaction.class';
import { TransactionType } from '../../models/transaction/transaction.types';
import { SagaTestBed } from '../helpers/saga-test-bed';
import { Accounts } from '../../atoms/accounts/accounts.atom';
import {
    loadAccountsSuccess,
    saveAccount,
    saveAccountFailed,
    saveAccountSuccess,
} from '../../atoms/accounts/accounts.actions';
import { expectCallEffect } from '../helpers/helpers.spec';
import { MonthUtils } from './month.saga';
import { UUID } from '../../models/common/common.types';
import { saveMonths, saveMonthsSuccess } from '../../atoms/months/months.actions';
import { delay, SagaUtils } from '../helpers/helpers';
import { Money } from '../../models/money/money.class';

describe('AccountUtils', () => {
    describe('select account saga', () => {
        let testBed: SagaTestBed;

        beforeEach(() => {
            testBed = new SagaTestBed();

            testBed.subscribe(Accounts);
            testBed.dispatch(loadAccountsSuccess([
                Account.create('test', 'test'),
                Account.create('test 2', '123'),
            ]));

            const accounts = testBed.getState(Accounts).accounts;
            expect(accounts.has('test')).toBeTruthy();
            expect(accounts.has('123')).toBeTruthy();
        });

        it('base', async () => {
            testBed.run(AccountUtils.select.originalSaga, 'test').then(
                (account: Account) => {
                    expect(account.id).toBe('test');
                },
                error => {
                    throw error;
                },
            );
        });
        it('not found', async () => {
            function* test() {
                try {
                    yield* AccountUtils.select('invalid uuid');
                    throw new Error('It must be throw error');
                } catch (error) {
                    expect(error.message).toBe(`Account "invalid uuid" not found`);
                }
            }

            await testBed.run(test);
        });
    });
    describe('update account saga', () => {
        const baseAccount = Account.create('test');
        const month01 = Month.createFirstBlock(baseAccount.id, '2020-01', 1592247158848);
        const month02 = month01.createNextBlock('2020-02', 1592247187258);
        const month04 = month02.createNextBlock('2020-04', 1592247202511);
        const startAccount = baseAccount.updateHead(month02, [month01, month02]);

        describe('create first block', () => {
            it('base', () => {
                const gen = AccountUtils.update.originalSaga(baseAccount, month01);

                // get timestamp
                {
                    const next = gen.next();
                    const effect = next.value as CallEffect;
                    expect(next.done).toBeFalsy();
                    expectCallEffect(effect, SagaUtils.getTimestamp);
                    expect(effect.payload.args).toEqual([]);
                }

                // save months
                {
                    const next = gen.next(1593226547352);
                    const effect = next.value as CallEffect;
                    expect(next.done).toBeFalsy();
                    expectCallEffect(effect, MonthUtils.save);
                    expect(effect.payload.args).toEqual([[month01]]);
                }

                // save account
                const r2 = gen.next();
                const r2effect = r2.value as CallEffect;
                expect(r2.done).toBeFalsy();
                expectCallEffect(r2effect, AccountUtils.save);
                const acc: Account = r2effect.payload.args[0];
                expect(acc).toBeInstanceOf(Account);
                expect(acc.id).toBe(startAccount.id);
                expect(acc.head).toEqual(month01.getBrief());
                expect(acc.months[0]).toEqual(month01.getBrief());

                // return updated account
                const r3 = gen.next();
                expect(r3.done).toBeTruthy();
                expect(r3.value).toStrictEqual(acc);
            });
        });
        describe('add month', () => {
            it('base', () => {
                const gen = AccountUtils.update.originalSaga(startAccount, month04);

                // get timestamp
                {
                    const next = gen.next();
                    const effect = next.value as CallEffect;
                    expect(next.done).toBeFalsy();
                    expectCallEffect(effect, SagaUtils.getTimestamp);
                    expect(effect.payload.args).toEqual([]);
                }

                // save months
                const r1 = gen.next(1593226547352);
                const r1effect = r1.value as CallEffect;
                expect(r1.done).toBeFalsy();
                expectCallEffect(r1effect, MonthUtils.save);
                expect(r1effect.payload.args).toEqual([[month04]]);

                // save account
                const r2 = gen.next();
                const r2effect = r2.value as CallEffect;
                expect(r2.done).toBeFalsy();
                expectCallEffect(r2effect, AccountUtils.save);
                const acc: Account = r2effect.payload.args[0];
                expect(acc).toBeInstanceOf(Account);
                expect(acc.id).toBe(startAccount.id);
                expect(acc.head).toEqual(month04.getBrief());
                expect(acc.months[0]).toEqual(month04.getBrief());

                // return updated account
                const r3 = gen.next();
                expect(r3.done).toBeTruthy();
                expect(r3.value).toStrictEqual(acc);
            });
        });
        describe('update month', () => {
            it('update last month', () => {
                // arrange
                const day = month02.createDay(3)
                                   .addTransaction(Transaction.createWithID('test-tx', TransactionType.Income, 1, 'RUB'));
                const month02upd = month02.updateDay(day);

                // act
                const gen = AccountUtils.update.originalSaga(startAccount, month02upd);

                // get timestamp
                {
                    const next = gen.next();
                    const effect = next.value as CallEffect;
                    expect(next.done).toBeFalsy();
                    expectCallEffect(effect, SagaUtils.getTimestamp);
                    expect(effect.payload.args).toEqual([]);
                }

                // save months
                const r1 = gen.next(1593226547352);
                const r1effect = r1.value as CallEffect;
                expect(r1.done).toBeFalsy();
                expectCallEffect(r1effect, MonthUtils.save);
                expect(r1effect.payload.args).toEqual([[month02upd]]);

                // save account
                const r2 = gen.next();
                const r2effect = r2.value as CallEffect;
                expect(r2.done).toBeFalsy();
                expectCallEffect(r2effect, AccountUtils.save);
                const acc: Account = r2effect.payload.args[0];
                expect(acc).toBeInstanceOf(Account);
                expect(acc.id).toBe(startAccount.id);
                expect(acc.head).toEqual(month02upd.getBrief());
                expect(acc.months[0]).toEqual(month02upd.getBrief());

                // return updated account
                const r3 = gen.next();
                expect(r3.done).toBeTruthy();
                expect(r3.value).toStrictEqual(acc);

                console.log(acc.balance.toString(), startAccount.balance.toString());
                expect(acc.balance.toString()).not.toEqual(startAccount.balance.toString());
            });
            it('update month in the middle', () => {
                // arrange
                const day = month02.createDay(3)
                                   .addTransaction(Transaction.createWithID('test-tx', TransactionType.Income, 1, 'RUB'));
                const month02upd = month02.updateDay(day);
                const accountUpd = startAccount.updateHead(month04);

                // act
                const gen = AccountUtils.update.originalSaga(accountUpd, month02upd);

                // load months
                {
                    const next = gen.next();
                    const effect = next.value as CallEffect;
                    expect(next.done).toBeFalsy();
                    expectCallEffect(effect, MonthUtils.getByIds);
                    expect(effect.payload.args).toEqual([[month04.id]]);
                }

                // get timestamp
                {
                    const next = gen.next([month04]);
                    const effect = next.value as CallEffect;
                    expect(next.done).toBeFalsy();
                    expectCallEffect(effect, SagaUtils.getTimestamp);
                    expect(effect.payload.args).toEqual([]);
                }

                const timestamp = 1593184787882;
                const month04upd = month04.updatePrevMonths([month02upd], timestamp);

                // expect(month04upd.summary.balanceOnStart.toString()).toEqual(month02upd.summary.balanceOnEnd.toString());

                // save months
                {
                    const next = gen.next(timestamp);
                    const effect = next.value as CallEffect;
                    expect(next.done).toBeFalsy();
                    expectCallEffect(effect, MonthUtils.save);
                    expect(effect.payload.args).toEqual([[month02upd, month04upd]]);
                }

                // save account
                let acc: Account;
                {
                    const next = gen.next();
                    const effect = next.value as CallEffect;
                    expect(next.done).toBeFalsy();
                    expectCallEffect(effect, AccountUtils.save);
                    acc = effect.payload.args[0];
                    expect(acc).toBeInstanceOf(Account);
                    expect(acc.id).toBe(startAccount.id);
                    expect(acc.head).toEqual(month04upd.getBrief());
                    expect(acc.months[0]).toEqual(month04upd.getBrief());
                    expect(acc.balance.toJSON()).toEqual(Money.create(1, 'RUB').toJSON());
                }

                // return updated account
                const r4 = gen.next();
                expect(r4.done).toBeTruthy();
                expect(r4.value).toStrictEqual(acc);

                console.log(acc.balance.toString(), startAccount.balance.toString());
                expect(acc.balance.toString()).not.toEqual(startAccount.balance.toString());
            });
            it('update first month', () => {
                // arrange
                const account = startAccount.updateHead(month04);

                const day = month01.createDay(3)
                                   .addTransaction(Transaction.createWithID('test-tx', TransactionType.Income, 10, 'RUB'));
                const month01upd = month01.updateDay(day);

                // act
                const gen = AccountUtils.update.originalSaga(account, month01upd);

                // load months
                {
                    const next = gen.next();
                    const effect = next.value as CallEffect;
                    expect(next.done).toBeFalsy();
                    expectCallEffect(effect, MonthUtils.getByIds);
                    expect(effect.payload.args).toEqual([[month04.id, month02.id]]);
                }

                // get timestamp
                {
                    const next = gen.next([month04, month02]);
                    const effect = next.value as CallEffect;
                    expect(next.done).toBeFalsy();
                    expectCallEffect(effect, SagaUtils.getTimestamp);
                    expect(effect.payload.args).toEqual([]);
                }

                const timestamp = 1593184787882;
                const month02upd = month02.updatePrevMonths([month01upd], timestamp);
                const month04upd = month04.updatePrevMonths([month02upd], timestamp);

                // save months
                {
                    const next = gen.next(timestamp);
                    const effect = next.value as CallEffect;
                    expect(next.done).toBeFalsy();
                    expectCallEffect(effect, MonthUtils.save);
                    expect(effect.payload.args).toEqual([[month01upd, month02upd, month04upd]]);
                }

                // save account
                let acc: Account;
                {
                    const next = gen.next();
                    const effect = next.value as CallEffect;
                    expect(next.done).toBeFalsy();
                    expectCallEffect(effect, AccountUtils.save);
                    acc = effect.payload.args[0];
                    expect(acc).toBeInstanceOf(Account);
                    expect(acc.id).toBe(startAccount.id);
                    expect(acc.head).toEqual(month04upd.getBrief());
                    expect(acc.months[0]).toEqual(month04upd.getBrief());
                    expect(acc.balance.toJSON()).toEqual(Money.create(10, 'RUB').toJSON());
                }

                // return updated account
                const r4 = gen.next();
                expect(r4.done).toBeTruthy();
                expect(r4.value).toStrictEqual(acc);

                expect(acc.balance.toString()).not.toEqual(startAccount.balance.toString());
            });
        });
    });
    describe('save account saga', () => {
        let testBed: SagaTestBed;

        beforeEach(() => {
            testBed = new SagaTestBed();
        });

        it('success', async () => {
            const account = Account.create('test');

            function* test() {
                return yield* AccountUtils.save(account);
            }

            // result
            testBed.run(test).then(
                () => null,
                error => {
                    throw error;
                },
            );

            // put action saveAccount
            expect(testBed.actions.length).toEqual(1);
            const putAction = testBed.actions.shift();
            expect(putAction).toEqual(saveAccount(account));

            // dispatch another saveMonthsComplete
            testBed.dispatch(saveAccountSuccess('another-month-id'));
            await delay();
            expect(testBed.isRunning).toBeTruthy();

            // dispatch expected saveMonthsComplete
            testBed.dispatch(saveAccountSuccess(account.id));
            await delay();
            expect(testBed.isCompleted).toBeTruthy();
        });

        it('error loading', async () => {
            const account = Account.create('test');

            function* test() {
                return yield* AccountUtils.save(account);
            }

            // result
            testBed.run(test).then(
                () => {
                    throw new Error('Must be error');
                },
                () => null,
            );

            // put action saveAccount
            expect(testBed.actions.length).toEqual(1);
            const putAction = testBed.actions.shift();
            expect(putAction).toEqual(saveAccount(account));

            // dispatch another saveMonthsComplete
            testBed.dispatch(saveAccountFailed({id: 'another-month-id', error: 'test'}));
            await delay();
            expect(testBed.isRunning).toBeTruthy();

            // dispatch expected saveMonthsComplete
            testBed.dispatch(saveAccountFailed({id: account.id, error: 'test'}));
            await delay();
            expect(testBed.isFailed).toBeTruthy();
        });
    });
});
