import { ICategory } from './category.types';
import { TransactionType } from '../transaction/transaction.types';
import { Category } from './category.class';

describe('Category class', () => {
    const parent: ICategory = {
        id: 'this-is-parents-uuid',
        name: 'Parent',
        parent: null,
        defaultTxType: TransactionType.Expense,
        image: 'default',
    };

    const demo: ICategory = {
        id: 'this-is-demo-uuid',
        name: 'Demo',
        parent: parent.id,
        defaultTxType: TransactionType.Income,
        image: 'modern',
    };

    describe('constructor', () => {
        it('can not create without id', () => {
            expect(() => Category.createInitial(
                'name',
                TransactionType.Income,
                null,
                'image',
                '',
            )).toThrow();
        });
        it('can not create without name', () => {
            expect(() => Category.create(
                '',
                TransactionType.Income,
                null,
                'image',
                '',
            )).toThrow();
        });
    });
    describe('usual category', () => {
        describe('create', () => {
            it('without parent and id', () => {
                const category = Category.create(
                    demo.name,
                    demo.defaultTxType,
                    null,
                );

                expect(category.id).not.toEqual(demo.id);
                expect(category.id.length).toEqual(36);
                expect(category.name).toEqual(demo.name);
                expect(category.defaultTxType).toEqual(demo.defaultTxType);
                expect(category.image).toEqual('default');
                expect(category.parent).toEqual(null);
                expect(category.isInitial).toEqual(false);
            });
            it('without parent and with id', () => {
                const category = Category.create(
                    demo.name,
                    demo.defaultTxType,
                    null,
                    demo.image,
                    demo.id,
                );

                expect(category.id).toEqual(demo.id);
                expect(category.name).toEqual(demo.name);
                expect(category.defaultTxType).toEqual(demo.defaultTxType);
                expect(category.image).toEqual(demo.image);
                expect(category.parent).toEqual(null);
                expect(category.isInitial).toEqual(false);
            });
            it('with parent (UUID)', () => {
                const category = Category.create(
                    demo.name,
                    demo.defaultTxType,
                    demo.parent,
                );

                expect(category.id).not.toEqual(demo.id);
                expect(category.id.length).toEqual(36);
                expect(category.name).toEqual(demo.name);
                expect(category.defaultTxType).toEqual(demo.defaultTxType);
                expect(category.parent).toEqual(demo.parent);
                expect(category.isInitial).toEqual(false);
            });
            it('with parent (ICategory)', () => {
                const category = Category.create(
                    demo.name,
                    demo.defaultTxType,
                    parent,
                );

                expect(category.id).not.toEqual(demo.id);
                expect(category.id.length).toEqual(36);
                expect(category.name).toEqual(demo.name);
                expect(category.defaultTxType).toEqual(demo.defaultTxType);
                expect(category.parent).toEqual(demo.parent);
                expect(category.isInitial).toEqual(false);
            });
        });
        describe('update', () => {
            const category = Category.create(
                demo.name,
                demo.defaultTxType,
                demo.parent,
                demo.image,
            );

            it('update name', () => {
                const result = category.setName('new-name');
                expect(result.name).toEqual('new-name');
            });

            it('update defaultTransactionType', () => {
                const result = category.setDefaultTransactionType(TransactionType.Income);
                expect(result.defaultTxType).toEqual(TransactionType.Income);
            });

            it('update image', () => {
                const result = category.setImage('new-image');
                expect(result.image).toEqual('new-image');
            });

            it('update setParent null', () => {
                const result = category.setParent(null);
                expect(result.parent).toEqual(null);
            });

            it('update setParent UUID', () => {
                const result = category.setParent('new-parent');
                expect(result.parent).toEqual('new-parent');
            });

            it('update setParent ICategory', () => {
                const newParent: ICategory = {
                    ...parent,
                    id: 'new-parent',
                };

                const result = category.setParent(newParent);
                expect(result.parent).toEqual(newParent.id);
            });
        });
        describe('packing', () => {
            it('base', () => {
                const category = Category.create(
                    demo.name,
                    demo.defaultTxType,
                    demo.parent,
                    demo.image,
                    demo.id,
                );
                const json = category.toJSON();
                expect(json).toEqual({
                    defaultTxType: demo.defaultTxType,
                    id: demo.id,
                    image: demo.image,
                    isInitial: false,
                    name: demo.name,
                    parent: demo.parent,
                });
                const restored = Category.fromJSON(json);
                expect(restored).toStrictEqual(category);
            });
        });
    });
    describe('initial category', () => {
        describe('create', () => {
            it('without parent', () => {
                const category = Category.createInitial(
                    demo.name,
                    demo.defaultTxType,
                    null,
                    demo.image,
                    demo.id,
                );

                expect(category.id).toEqual(demo.id);
                expect(category.name).toEqual(demo.name);
                expect(category.defaultTxType).toEqual(demo.defaultTxType);
                expect(category.image).toEqual(demo.image);
                expect(category.parent).toEqual(null);
                expect(category.isInitial).toEqual(true);
            });
            it('with parent (UUID)', () => {
                const category = Category.createInitial(
                    demo.name,
                    demo.defaultTxType,
                    demo.parent,
                    demo.image,
                    demo.id,
                );

                expect(category.id).toEqual(demo.id);
                expect(category.name).toEqual(demo.name);
                expect(category.defaultTxType).toEqual(demo.defaultTxType);
                expect(category.parent).toEqual(demo.parent);
                expect(category.isInitial).toEqual(true);
            });
            it('with parent (ICategory)', () => {
                const category = Category.createInitial(
                    demo.name,
                    demo.defaultTxType,
                    parent,
                    demo.image,
                    demo.id,
                );

                expect(category.id).toEqual(demo.id);
                expect(category.name).toEqual(demo.name);
                expect(category.defaultTxType).toEqual(demo.defaultTxType);
                expect(category.parent).toEqual(demo.parent);
                expect(category.isInitial).toEqual(true);
            });
        });
        describe('update', () => {
            const category = Category.createInitial(
                demo.name,
                demo.defaultTxType,
                demo.parent,
                demo.image,
                demo.id,
            );

            it('update name', () => {
                expect(() => category.setName('new-name'))
                    .toThrow(`Can not set name to initial category`);
            });

            it('update defaultTransactionType', () => {
                const result = category.setDefaultTransactionType(TransactionType.Income);
                expect(result.defaultTxType).toEqual(TransactionType.Income);
            });

            it('update image', () => {
                const result = category.setImage('new-image');
                expect(result.image).toEqual('new-image');
            });

            it('update setParent null', () => {
                expect(() => category.setParent(null))
                    .toThrow(`Can not set parent to initial category`);
            });

            it('update setParent UUID', () => {
                expect(() => category.setParent('new-parent'))
                    .toThrow(`Can not set parent to initial category`);
            });

            it('update setParent ICategory', () => {
                const newParent: ICategory = {
                    ...parent,
                    id: 'new-parent',
                };

                expect(() => category.setParent(newParent))
                    .toThrow(`Can not set parent to initial category`);
            });
        });
        describe('packing', () => {
            it('base', () => {
                const category = Category.create(
                    demo.name,
                    demo.defaultTxType,
                    demo.parent,
                    demo.image,
                    demo.id,
                );
                const json = Category.toJSON(category);
                expect(json).toEqual({
                    defaultTxType: demo.defaultTxType,
                    id: demo.id,
                    image: demo.image,
                    isInitial: false,
                    name: demo.name,
                    parent: demo.parent,
                });
                const restored = Category.fromJSON(json);
                expect(restored).toStrictEqual(category);
            });
        });
    });
});
