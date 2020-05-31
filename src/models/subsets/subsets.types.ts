import { ISubset } from '../subset/subset.types';

export interface ISubsetsState {
    current: ISubset | null; // TODO
    all: ISubset[];
}
