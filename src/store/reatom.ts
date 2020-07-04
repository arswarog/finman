import { Reducer, useContext, useEffect, useReducer } from 'react';
import { Atom } from '@reatom/core';
import { context } from '@reatom/react';

// Предварительное решение пока не будет решена основная проблема

// function useForceUpdate() {
//     const [state, dispatch] = useReducer(s => {
//         console.log('reducer', s);
//         return s + 1;
//     }, 0);
//     return () => {
//         console.log('reducer state', state);
//         dispatch();
//     };
// }

export function useForceUpdate() {
    // dispatch don't have action and don't changes between rerenders
    return useReducer<Reducer<number, null>>(s => s + 1, 0)[1] as () => void;
}

const defaultMapper = (atomValue: any) => atomValue;

export function useAtom<T>(atom: Atom<T>): T;
export function useAtom<TI, TO = TI>(
    atom: Atom<TI>,
    selector: (atomValue: TI) => TO,
    deps: any[],
): TO;
export function useAtom<TI, TO = TI>(
    atom: Atom<TI>,
    selector: (atomValue: TI) => TO = defaultMapper,
    deps: any[] = [],
): TO {
    const store = useContext(context);
    console.log('by forceUpdate', atom);
    const forceUpdate = useForceUpdate();
    const value = selector(store.getState(atom));
    useEffect(() => {
        return store.subscribe(atom, state => {
            console.log('new value', state, selector(state));
            forceUpdate();
        });
    }, deps);

    return value;
}
