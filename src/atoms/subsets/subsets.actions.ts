import { declareAction } from '@reatom/core';
import { UUID } from '../../models/common/common.types';

const NS = 'subsets';
export const chooseSubset = declareAction<UUID>(NS + ':chooseSubset');
