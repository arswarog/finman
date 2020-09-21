import { declareAction } from '@reatom/core';
import { ITransactionForm } from './transaction.types';
import { IFormFailed } from '../helper';

const NS = 'transaction';

export const addTransaction = declareAction<ITransactionForm>(NS + ':addTransaction');
export const addTransactionSuccess = declareAction<ITransactionForm>(NS + ':addTransaction success');
export const addTransactionFailed = declareAction<IFormFailed<ITransactionForm>>(NS + ':addTransaction failed');
export const updateTransaction = declareAction<ITransactionForm>(NS + ':updateTransaction');
export const updateTransactionSuccess = declareAction<ITransactionForm>(NS + ':updateTransaction success');
export const updateTransactionFailed = declareAction<IFormFailed<ITransactionForm>>(NS + ':updateTransaction failed');
