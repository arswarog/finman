import { Month } from '../../month/month.class';
import { Account } from '../../account/account.class';
import { AccountUtils } from './account.saga';
import { CallEffect } from 'redux-saga/effects';
import { SyncStatus } from '../../month/month.types';
import { Transaction } from '../../transaction/transaction.class';
import { TransactionType } from '../../transaction/transaction.types';
import { SagaTestBed } from '../helpers/saga-test-bed';
import { Accounts } from '../../accounts/accounts.atom';
import { loadAccountsSuccess } from '../../accounts/accounts.actions';
import { expectCallEffect } from '../helpers/helpers.spec';
import { MonthUtils } from './month.saga';
import { UUID } from '../../common/common.types';
import { saveMonths, saveMonthsSuccess } from '../../months/months.actions';
import { delay } from '../helpers/helpers';

describe('AccountUtils', () => {
    describe('selectAccount', () => {
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
    describe('update saga', () => {
        const baseAccount = Account.create('test');
        const month01 = Month.createFirstBlock(baseAccount.id, '2020-01', 1592247158848)
                             .changeSyncStatus(SyncStatus.Prepared);
        const month02 = month01.createNextBlock('2020-02', 1592247187258)
                               .changeSyncStatus(SyncStatus.Prepared);
        const month04 = month02.createNextBlock('2020-04', 1592247202511)
                               .changeSyncStatus(SyncStatus.Prepared);
        const account = baseAccount.updateHead(month02, [month01, month02]);

        describe('create first block', () => {
            it('base', () => {
                const gen = AccountUtils.update.originalSaga(baseAccount, month01);

                // save months
                const r1 = gen.next();
                const r1effect = r1.value as CallEffect;
                expect(r1.done).toBeFalsy();
                expectCallEffect(r1effect, MonthUtils.save);
                expect(r1effect.payload.args).toEqual([[month01]]);

                // save account
                const r2 = gen.next();
                const r2effect = r2.value as CallEffect;
                expect(r2.done).toBeFalsy();
                expectCallEffect(r2effect, AccountUtils.save);
                const acc: Account = r2effect.payload.args[0];
                expect(acc).toBeInstanceOf(Account);
                expect(acc.id).toBe(account.id);
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
                const gen = AccountUtils.update.originalSaga(account, month04);

                // save months
                const r1 = gen.next();
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
                expect(acc.id).toBe(account.id);
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
                const gen = AccountUtils.update.originalSaga(account, month02upd);

                // save months
                const r1 = gen.next();
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
                expect(acc.id).toBe(account.id);
                expect(acc.head).toEqual(month02upd.getBrief());
                expect(acc.months[0]).toEqual(month02upd.getBrief());

                // return updated account
                const r3 = gen.next();
                expect(r3.done).toBeTruthy();
                expect(r3.value).toStrictEqual(acc);

                console.log(acc.balance.toString(), account.balance.toString());
                expect(acc.balance.toString()).not.toEqual(account.balance.toString());
            });
            it('update month in the middle', () => {
                throw new Error('Not implements');
            });
            it('update first month', () => {
                throw new Error('Not implements');
            });
        });
    });
    describe('saveAccountSaga', () => {
        let testBed: SagaTestBed;

        beforeEach(() => {
            testBed = new SagaTestBed();
        });

        it('base', async () => {
            const account = Account.create('test');

            function* test(ids: UUID[]) {
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
            expect(putAction).toEqual(saveMonths([month]));

            // dispatch another saveMonthsComplete
            testBed.dispatch(saveMonthsSuccess(['another-month-id']));
            await delay();
            expect(testBed.isRunning).toBeTruthy();

            // dispatch expected saveMonthsComplete
            testBed.dispatch(saveMonthsSuccess([month.id]));
            await delay();
            expect(testBed.isCompleted).toBeTruthy();
        });
    });
});
