import { Month } from '../month/month.class';
import { isVersionOfMonth, updateMonthChain } from './chain.utils';
import { Transaction } from '../transaction/transaction.class';
import { TransactionType } from '../transaction/transaction.types';
import { SyncStatus } from '../month/month.types';
import { Day } from '../day/day.class';

describe('chain utils', () => {
    const account = '0-0-0-1';
    describe('updateChain', () => {
        describe('create new chain', () => {
            it('from 1 block', () => {
                const first = Month.createFirstBlock(account, '2020-01', 1590915748404);

                const chain = updateMonthChain(first, [], []);

                expect(chain.length).toBe(1);
                expect(chain[0].id).toBe(first.id);
            });
            it('from head and some blocks', () => {
                const first = Month.createFirstBlock(account, '2020-01', 1590915748404);
                const second = first.createNextBlock('2020-02', 1590916683981);
                const third = second.createNextBlock('2020-03', 1590916753742);

                const chain = updateMonthChain(third, [second, first], []);

                expect(chain.length).toBe(3);
                expect(chain[0].id).toBe(third.id);
                expect(chain[1].id).toBe(second.id);
                expect(chain[2].id).toBe(first.id);
            });
            it('from head and some need and not needs blocks', () => {
                const first = Month.createFirstBlock(account, '2020-01', 1590915748404);
                const second = first.createNextBlock('2020-02', 1590916683981);
                const third = second.createNextBlock('2020-03', 1590916753742);

                const chain = updateMonthChain(second, [third, first], []);

                expect(chain.length).toBe(2);
                expect(chain[0].id).toBe(second.id);
                expect(chain[1].id).toBe(first.id);
            });
            it('from head and without needed blocks, negative', () => {
                const first = Month.createFirstBlock(account, '2020-01', 1590915748404);
                const second = first.createNextBlock('2020-02', 1590916683981);
                const third = second.createNextBlock('2020-03', 1590916753742);
                const another = Month.createFirstBlock(account, '2010-01', 1590916905020);

                expect(() => updateMonthChain(third, [second, another], []))
                    .toThrow(`Required months: ${first.id}`);
            });
        });
        describe('update', () => {
            const oldFirst = Month.createFirstBlock(account, '2020-01', 1590915748404);
            const oldSecond = oldFirst.createNextBlock('2020-02', 1590916683981);
            const oldThird = oldSecond.createNextBlock('2020-03', 1590916753742)
                                      .updateDay(Day.create('2020-03-01')
                                                    .addTransaction(Transaction.create(TransactionType.Income, 1, 'RUB')))
                                      .changeSyncStatus(SyncStatus.Prepared);

            const oldChain = [
                oldThird.getBrief(),
                oldSecond.getBrief(),
                oldFirst.getBrief(),
            ];

            it('only head, new month', () => {
                const head = oldThird.createNextBlock('2020-04', 1590928776103);

                const chain = updateMonthChain(head, [], oldChain);

                expect(chain).toEqual([
                    head.getBrief(),
                    ...oldChain,
                ]);
            });
            it('only head, new 2 months (and 1 exists)', () => {
                const fourth = oldThird.createNextBlock('2020-04', 1590928776103);
                const head = fourth.createNextBlock('2020-05', 1590930839101);

                const chain = updateMonthChain(head, [fourth, oldThird], oldChain);

                expect(chain).toEqual([
                    head.getBrief(),
                    fourth.getBrief(),
                    ...oldChain,
                ]);
            });
            it('only head, update last month', () => {
                const day = oldThird.createDay(5)
                                    .addTransaction(Transaction.createWithID('0-1-0-0', TransactionType.Income, 5, 'RUB'));
                const head = oldThird
                    .updateDay(day);

                const chain = updateMonthChain(head, [], oldChain);

                expect(chain).toEqual([
                    head.getBrief(),
                    ...oldChain.slice(1),
                ]);
            });
            it('only head, recreate last month (fail)', () => {
                const head = oldSecond.createNextBlock('2020-03', 1590929931406);

                expect(head).toEqual(oldThird);
                expect(head.id).not.toEqual(oldThird.id);

                expect(() => updateMonthChain(head, [], oldChain))
                    .toThrow(`Can not fast forward`);
            });
            it('some blocks (with one no needed block)', () => { // FIXME needs merge method
                const day1 = oldSecond.createDay(5)
                                      .addTransaction(Transaction.createWithID('0-1-0-0', TransactionType.Income, 5, 'RUB'));
                const second = oldSecond.updateDay(day1);

                const head = Object.assign({}, oldThird, {
                    prevMonths: [second.id],
                    prevVersions: [oldThird.id],
                }); // TODO
                Object.assign(head, {
                    id: Month.generateID(head, oldThird.dataHash),
                });

                const another = Month.createFirstBlock(account, '2010-01', 1590916905020);

                const chain = updateMonthChain(
                    Month.getBrief(head),
                    [
                        second, // needs
                        another, // no needs
                    ],
                    oldChain,
                );

                expect(chain).toEqual([
                    Month.getBrief(head),
                    Month.getBrief(second),
                    oldFirst.getBrief(),
                ]);
            });
            it('some blocks (with one no needed block, and one exists block)', () => { // FIXME needs merge method
                const day1 = oldSecond.createDay(5)
                                      .addTransaction(Transaction.createWithID('0-1-0-0', TransactionType.Income, 5, 'RUB'));
                const second = oldSecond.updateDay(day1);

                const head = Object.assign({}, oldThird, {
                    prevMonths: [second.id],
                    prevVersions: [oldThird.id],
                }); // TODO
                Object.assign(head, {
                    id: Month.generateID(head, oldThird.dataHash),
                });

                const another = Month.createFirstBlock(account, '2010-01', 1590916905020);

                const chain = updateMonthChain(
                    Month.getBrief(head),
                    [
                        second, // needs
                        oldFirst, // exists
                        another, // no needs
                    ],
                    oldChain,
                );

                expect(chain).toEqual([
                    Month.getBrief(head),
                    Month.getBrief(second),
                    oldFirst.getBrief(),
                ]);
            });
            it('without needed blocks, negative', () => {
                const day1 = oldSecond.createDay(5)
                                      .addTransaction(Transaction.createWithID('0-1-0-0', TransactionType.Income, 5, 'RUB'));
                const second = oldSecond.updateDay(day1);

                const head = Object.assign({}, oldThird, {prevMonths: [second.id]}); // TODO

                expect(() => updateMonthChain(
                    Month.getBrief(head),
                    [
                        oldFirst, // exists
                    ],
                    oldChain,
                ))
                    .toThrow(`Required months: ${second.id}`);
            });
            it('full update chain (1 item), negative', () => {
                const head = Month.createFirstBlock(account, '2020-10', 1590930663592);

                expect(() => updateMonthChain(head, [], oldChain))
                    .toThrow('Can not fast forward');
            });
            it('full update chain (2 items), negative', () => {
                const first = Month.createFirstBlock(account, '2020-10', 1590930663592);
                const head = first.createNextBlock('2020-11', 1591000537099);

                expect(() => updateMonthChain(head, [], oldChain))
                    .toThrow(`Required months: ${first.id}`);
            });
        });
    });
    describe('isVersionOfMonth', () => {
        describe('positive (synced blocks)', () => {
            const v1 = Month.createFirstBlock(account, '2020-01', 1590993021517);
            const v2day = v1.createDay(5)
                            .addTransaction(Transaction.createWithID('0-1-0-0', TransactionType.Income, 5, 'RUB'));
            const v2 = v1.updateDay(v2day).changeSyncStatus(SyncStatus.Prepared);
            console.log(v2);
            const v3day = v1.createDay(4)
                            .addTransaction(Transaction.createWithID('1-1-0-0', TransactionType.Income, 5, 'RUB'));
            const v3 = v2.updateDay(v3day).changeSyncStatus(SyncStatus.Prepared);

            const another = Month.createFirstBlock(account, '2020-02', 1590993200351);

            it('prepare check', () => {
                expect(v1.prevVersions).toEqual([]);
                expect(v2.prevVersions).toEqual([v1.id]);
                expect(v3.prevVersions).toEqual([v2.id]);
                expect(another.prevVersions).toEqual([]);
            });
            it('same version', () => {
                expect(
                    isVersionOfMonth(v1, v1, [v1, v2, another]),
                ).toBe(true);
            });
            it('1 diff', () => {
                console.log(v1.id);
                expect(
                    isVersionOfMonth(v2, v1, []),
                ).toBe(true);
            });
            it('2 diffs', () => {
                expect(
                    isVersionOfMonth(v3, v1, [v1, v2, v3, another]),
                ).toBe(true);
            });
            describe('require month', () => {
                it('2 diffs', () => {
                    expect(
                        () => isVersionOfMonth(v3, v1, [another]),
                    ).toThrow(`Required months: ${v2.id}`);
                });
            });
        });
        describe('update not synced block', () => {
            const v1 = Month.createFirstBlock(account, '2020-01', 1590993021517);
            const v2day = v1.createDay(5)
                            .addTransaction(Transaction.createWithID('0-1-0-0', TransactionType.Income, 5, 'RUB'));
            const v2 = v1.updateDay(v2day).changeSyncStatus(SyncStatus.Prepared);
            console.log(v2);
            const v3day = v1.createDay(4)
                            .addTransaction(Transaction.createWithID('1-1-0-0', TransactionType.Income, 5, 'RUB'));
            const v3 = v2.updateDay(v3day);

            const another = Month.createFirstBlock(account, '2020-02', 1590993200351);

            it('prepare check', () => {
                expect(v1.prevVersions).toEqual([]);
                expect(v2.prevVersions).toEqual([v1.id]);
                expect(v3.prevVersions).toEqual([v2.id]);
                expect(another.prevVersions).toEqual([]);
            });
            it('same version', () => {
                expect(
                    isVersionOfMonth(v1, v1, [v1, v2, another]),
                ).toBe(true);
            });
            it('1 diff', () => {
                console.log(v1.id);
                expect(
                    isVersionOfMonth(v2, v1, []),
                ).toBe(true);
            });
            it('2 diffs', () => {
                expect(
                    isVersionOfMonth(v3, v2, [v1, v2, v3, another]),
                ).toBe(true);
            });
        });
    });
});
