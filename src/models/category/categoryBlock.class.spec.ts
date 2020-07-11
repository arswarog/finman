import { ICategoryTree } from './category.types';
import { TransactionType } from '../transaction/transaction.types';
import { Category } from './category.class';
import { CategoryBlock } from './categoryBlock.class';
import { IExtendSummary, SyncStatus } from '../common/common.types';

describe('CategoryBlock class', () => {
    const accountId = '0000-0001';
    const baseInitialsCategories: ICategoryTree = [
        {
            id: '01-00',
            name: 'Home',
            defaultType: TransactionType.Expense,
            image: 'home',
            children: [
                {
                    id: '01-01',
                    name: 'Home payments',
                    defaultType: TransactionType.Expense,
                    image: 'payments',
                },
            ],
        },
        {
            id: '02-00',
            name: 'Car',
            defaultType: TransactionType.Expense,
            image: 'car',
            children: [
                {
                    id: '02-01',
                    name: 'Wheels',
                    defaultType: TransactionType.Expense,
                    image: 'car',
                },
                {
                    id: '02-02',
                    name: 'Taxi',
                    defaultType: TransactionType.Income,
                    image: 'taxi',
                },
            ],
        },
        {
            id: '03-00',
            name: 'Work',
            defaultType: TransactionType.Expense,
            image: 'work',
            children: [],
        },
    ];

    describe('service methods', () => {
        describe('getDataHash', () => {
            it('base', () => {
                const list = baseInitialsCategories.map(
                    parent => Category.createInitial(
                        parent.name,
                        parent.defaultType,
                        null,
                        parent.image,
                        parent.id,
                    ),
                );

                const hash = CategoryBlock.getDataHash({list});

                expect(hash).toBe('31a19bb718d6594cc1e475de151e1939731cc4b8');
            });
        });
        describe('generateID', () => {
            it('empty', () => {
                const dataHash = '0000000000000000000000000000000000000000';

                const block = {
                    version: 1,
                    account: accountId,
                    prevVersions: [],
                    timestamp: 1594156526682,
                };

                const id = CategoryBlock.generateID(block as any, dataHash);

                expect(id.length).toBe(36);
                expect(id).toBe('00000000-0000-0000-0000-000000000000');
            });
            it('base', () => {
                const dataHash = '5d0569bf2e12f90c5a67fc61d88b2900bbaf4fbf';

                const block = {
                    version: 1,
                    account: accountId,
                    prevVersions: [],
                    timestamp: 1594156526682,
                };

                const id = CategoryBlock.generateID(block as any, dataHash);

                expect(id.length).toBe(36);
                expect(id).toBe('5bc54e20-0828-1d05-deb5-a5f0c93b94a1');
            });
        });
    });
    describe('createInitialBlock', () => {
        it('empty block', () => {
            const timestamp = 1588291200000;
            const block = CategoryBlock.createInitialBlock(
                accountId,
                [],
                timestamp,
            );

            expect(block.id).toBe('00000000-0000-0000-0000-000000000000');
            expect(block.account).toBe(accountId);
            expect(block.version).toBe(1);
            expect(block.syncStatus).toBe(SyncStatus.Prepared);
            expect(block.dataHash).toBe('0000000000000000000000000000000000000000');
            expect(block.timestamp).toBe(timestamp);
            expect(block.prevVersions).toEqual([]);
            expect(block.updatedAt).toEqual(new Date(timestamp));

            const list: Category[] = baseInitialsCategories.flatMap(
                parent => [
                    Category.createInitial(
                        parent.name,
                        parent.defaultType,
                        null,
                        parent.image,
                        parent.id,
                    ),
                    ...parent.children.map(
                        child => Category.createInitial(
                            child.name,
                            child.defaultType,
                            parent.id,
                            child.image,
                            child.id,
                        ),
                    ),
                ],
            );

            expect(block.list).toEqual([]);
        });
        it('base', () => {
            const timestamp = 1588291200000;
            const block = CategoryBlock.createInitialBlock(
                accountId,
                baseInitialsCategories,
                timestamp,
            );

            expect(block.id.length).toBe(36);
            expect(block.account).toBe(accountId);
            expect(block.version).toBe(1);
            expect(block.syncStatus).toBe(SyncStatus.Prepared);
            expect(block.dataHash).not.toBe('0000000000000000000000000000000000000000');
            expect(block.timestamp).toBe(timestamp);
            expect(block.prevVersions).toEqual([]);
            expect(block.updatedAt).toEqual(new Date(timestamp));

            const list: Category[] = baseInitialsCategories.flatMap(
                parent => [
                    Category.createInitial(
                        parent.name,
                        parent.defaultType,
                        null,
                        parent.image,
                        parent.id,
                    ),
                    ...parent.children.map(
                        child => Category.createInitial(
                            child.name,
                            child.defaultType,
                            parent.id,
                            child.image,
                            child.id,
                        ),
                    ),
                ],
            );

            expect(block.list).toEqual(list);
        });
    });
    describe('syncStatus', () => {
        const someCategory = Category.createInitial(
            'category',
            TransactionType.Income,
            null,
            'default',
            '0001-0000',
        );

        describe('change', () => {
            function checkForFailingToChangeStatus(block: CategoryBlock, baseStatus: SyncStatus, statuses: SyncStatus[]) {
                it(`to ${SyncStatus[baseStatus]} (not changed)`, () => {
                    expect(block.syncStatus).toEqual(baseStatus);

                    const newBlock = block.changeSyncStatus(baseStatus);

                    expect(newBlock.syncStatus).toEqual(baseStatus);
                    expect(newBlock === block).toBeTruthy();
                });

                statuses.forEach(status =>
                    it(`to ${SyncStatus[status]} (not accepted)`, () => {
                        expect(block.syncStatus).toEqual(baseStatus);

                        expect(() => block.changeSyncStatus(status))
                            .toThrowError(/Can not change sync status from "\w+" to "\w+"/);
                    }),
                );
            }

            describe('from NotSynced', () => {
                const base = CategoryBlock
                    .createInitialBlock(accountId, baseInitialsCategories, 123151213235)
                    .addCategory(someCategory);

                checkForFailingToChangeStatus(
                    base,
                    SyncStatus.NoSynced,
                    [
                        // SyncStatus.NoSynced,
                        SyncStatus.Syncing,
                        SyncStatus.FullySynced,
                    ],
                );

                it('to Prepared', () => {
                    expect(base.syncStatus).toEqual(SyncStatus.NoSynced);

                    const block = base.changeSyncStatus(SyncStatus.Prepared);

                    expect(block.syncStatus).toBe(SyncStatus.Prepared);
                });
            });
            describe('from Prepared', () => {
                const base = CategoryBlock.createInitialBlock(accountId, baseInitialsCategories, 123151213235)
                                          .addCategory(someCategory)
                                          .changeSyncStatus(SyncStatus.Prepared);

                checkForFailingToChangeStatus(
                    base,
                    SyncStatus.Prepared,
                    [
                        SyncStatus.NoSynced,
                        // SyncStatus.Prepared,
                        SyncStatus.FullySynced,
                    ],
                );

                it('to Syncing', () => {
                    expect(base.syncStatus).toEqual(SyncStatus.Prepared);

                    const block = base.changeSyncStatus(SyncStatus.Syncing);

                    expect(block.syncStatus).toBe(SyncStatus.Syncing);
                });
            });
            describe('from Syncing', () => {
                const base = CategoryBlock.createInitialBlock(accountId, baseInitialsCategories, 123151213235)
                                          .addCategory(someCategory)
                                          .changeSyncStatus(SyncStatus.Prepared)
                                          .changeSyncStatus(SyncStatus.Syncing);

                checkForFailingToChangeStatus(
                    base,
                    SyncStatus.Syncing,
                    [
                        SyncStatus.NoSynced,
                        SyncStatus.Prepared,
                        // SyncStatus.Syncing,
                    ],
                );

                it('to FullySynced', () => {
                    expect(base.syncStatus).toEqual(SyncStatus.Syncing);

                    const block = base.changeSyncStatus(SyncStatus.FullySynced);

                    expect(block.syncStatus).toBe(SyncStatus.FullySynced);
                });
            });
            describe('from FullySynced', () => {
                const base = CategoryBlock.createInitialBlock(accountId, baseInitialsCategories, 123151213235)
                                          .addCategory(someCategory)
                                          .changeSyncStatus(SyncStatus.Prepared)
                                          .changeSyncStatus(SyncStatus.Syncing)
                                          .changeSyncStatus(SyncStatus.FullySynced);

                checkForFailingToChangeStatus(
                    base,
                    SyncStatus.FullySynced,
                    [
                        SyncStatus.NoSynced,
                        SyncStatus.Prepared,
                        SyncStatus.Syncing,
                        // SyncStatus.FullySynced,
                    ],
                );
            });
        });
    });
    describe('categories', () => {
        const timestamp = 1588291200000;
        const baseBlock = CategoryBlock.createInitialBlock(
            accountId,
            baseInitialsCategories,
            timestamp,
        );
        const someCategory = Category.createInitial(
            'category',
            TransactionType.Income,
            null,
            'default',
            '0001-0000',
        );
        describe('add', () => {
            it('add new', () => {
                const block = baseBlock.addCategory(someCategory);

                expect(block.id).not.toEqual(baseBlock.id);
                expect(block.dataHash).not.toEqual(baseBlock.dataHash);
                expect(block.syncStatus).toEqual(SyncStatus.NoSynced);
                expect(block.list).toEqual([
                    ...baseBlock.list,
                    someCategory,
                ]);
            });
            it('add with exists id', () => {
                const category = Category.createInitial(
                    'category',
                    TransactionType.Income,
                    null,
                    'default',
                    '01-00',
                );
                expect(() => baseBlock.addCategory(category))
                    .toThrow(`Category with this ID already exists`);
            });
            it('add with exists name (but in another register)', () => {
                const category = Category.createInitial(
                    'home',
                    TransactionType.Income,
                    null,
                    'default',
                    '0001-0000',
                );
                expect(() => baseBlock.addCategory(category))
                    .toThrow(`Category with this Name already exists`);
            });
        });
        describe('getList (root, without parent)', () => {
            it('list', () => {
                const list = baseBlock.list;
                expect(list.length).toBe(6);
            });
            it('getList()', () => {
                const list = baseBlock.getList();
                expect(list.length).toBe(6);
            });
        });
        describe('getList (children, with parent)', () => {
            it('1 child', () => {
                const list = baseBlock.getList('01-00');
                expect(list.length).toBe(1);
            });
            it('2 children', () => {
                const list = baseBlock.getList('02-00');
                expect(list.length).toBe(2);
            });
            it('no children', () => {
                const list = baseBlock.getList('03-00');
                expect(list.length).toBe(0);
            });
            it('unknown parent id', () => {
                const list = baseBlock.getList('unknown-id');
                expect(list.length).toBe(0);
            });
            it('call with child id', () => {
                const list = baseBlock.getList('01-01');
                expect(list.length).toBe(0);
            });
        });
        describe('update', () => {
            const updatedCategory = Category.create(
                'category',
                TransactionType.Income,
                null,
                'default',
                '0001-0000',
            );
            const updatedBlock = baseBlock.addCategory(updatedCategory);
            it('base', () => {
                const category = updatedBlock.list[0].setImage('new-image');

                const block = updatedBlock.updateCategory(category);

                expect(block.id).not.toEqual(updatedBlock.id);
                expect(block.dataHash).not.toEqual(updatedBlock.dataHash);
                expect(block.syncStatus).toEqual(SyncStatus.NoSynced);
                expect(block.list.length).toEqual(updatedBlock.list.length);
                expect(block.list[0]).not.toEqual(updatedBlock.list[0]);
                expect(block.list[0].image).toEqual('new-image');
            });
            it('deny no update category with exists Name', () => {
                const category = updatedCategory.setName('home');
                expect(() => updatedBlock.updateCategory(category))
                    .toThrow(`Category with name "${category.name}" already exists`);
            });
            it('unknown category', () => {
                const category = Category.createInitial(
                    'another category',
                    TransactionType.Income,
                    null,
                    'default',
                    'another-id',
                );
                expect(() => updatedBlock.updateCategory(category))
                    .toThrow(`Category "${category.name}" (${category.id}) not found`);
            });
        });
        describe('remove', () => {
            const updatedCategory = Category.create(
                'category',
                TransactionType.Income,
                null,
                'default',
                '0001-0000',
            );
            const updatedBlock = baseBlock.addCategory(updatedCategory);
            it('base', () => {
                const block = updatedBlock.removeCategory(updatedCategory.id);

                expect(block.id).not.toEqual(updatedBlock.id);
                expect(block.dataHash).not.toEqual(updatedBlock.dataHash);
                expect(block.syncStatus).toEqual(SyncStatus.NoSynced);
                expect(block.list.length).toEqual(updatedBlock.list.length - 1);
            });
            it('deny to delete unknown category', () => {
                expect(() => updatedBlock.removeCategory(  'another-id'))
                    .toThrow(`Category another-id not found`);
            });
        });
    });
    describe('encoding/decoding', () => {
        describe('fromJSON', () => {
            it('base', () => {
                throw new Error('Not implemented');
            });
        });
        describe('toJSON', () => {
            it('base', () => {
                throw new Error('Not implemented');
            });
        });
    });
});