import { declareAction } from '@reatom/core';
import { IAddTransactionForm } from './transaction.types';

const NS = 'transaction';

export const addTransaction = declareAction<IAddTransactionForm>(NS + ':addTransaction');
