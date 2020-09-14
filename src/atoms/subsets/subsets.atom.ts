import { declareAtom } from '@reatom/core';
import { ISubsetsState } from './subsets.types';
import { Subset } from '../../models/subset/subset.class';
import { Money } from '../../models/money/money.class';

export const Subsets = declareAtom<ISubsetsState>(
    ['subsets'],
    undefined,
    on => ({}),
);
