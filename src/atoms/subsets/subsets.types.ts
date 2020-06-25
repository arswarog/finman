import { ISubset } from '../../models/subset/subset.types';

export interface ISubsetsState {
    current: ISubset | null; // TODO
    all: ISubset[];
}
