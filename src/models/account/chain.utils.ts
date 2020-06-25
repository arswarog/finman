import { IMonthBrief } from '../month/month.types';
import { Month } from '../month/month.class';
import { UUID } from '../common/common.types';

/**
 * Обновление цепочки
 * @param head Новая голова
 * @param additions Обновленные звенья
 * @param old Старая цепочка
 */
export function updateMonthChain(head: IMonthBrief | Month,
                                 additions: ReadonlyArray<IMonthBrief | Month>,
                                 old: ReadonlyArray<IMonthBrief>): ReadonlyArray<IMonthBrief> {
    head = Month.getBrief(head);

    additions = additions.map(Month.getBrief);

    old = old.map(Month.getBrief);

    const {chain, completed} = findChain(head, additions);

    // console.log(completed, chain.map(item => item.month + ' ' + item.id), old.length);

    if (old.length === 0)
        if (completed)
            return chain;
        else
            throw new RequiredMonthsError(...chain.pop()!.prevMonths);

    if (completed) {
        if (!isVersionOfMonth(chain[chain.length - 1], old[old.length - 1], additions))
            throw new CanNotFastForwardMonthError(old, chain);
    } else {
        const first = chain[chain.length - 1];

        const preFirstID = first.prevMonths[0];

        const preFirstIndex = old.findIndex(item => item.id === preFirstID);

        console.log('completed', completed);
        console.log('preFirstIndex', preFirstIndex);

        console.log('head', [head.month, head.id, head.prevMonths, head.prevVersions].join(' '));
        console.log('adds');
        console.log(additions.map(item => [item.month, item.id, item.prevMonths, item.prevVersions].join(' ')));
        console.log('old chain');
        console.log(old.map(item => [item.month, item.id, item.prevMonths, item.prevVersions].join(' ')));

        if (preFirstIndex === -1)
            throw new RequiredMonthsError(preFirstID);
    }

    const monthsNumbersSet = new Set();
    // for (let i = 0; i < preFirstIndex; i++)
    //     monthsNumbersSet.add(old[i].month);
    old.forEach(item => monthsNumbersSet.add(item.month));

    chain.forEach(item => monthsNumbersSet.add(item.month));

    const monthsNumbers = Array.from(monthsNumbersSet.keys());
    monthsNumbers.sort();

    const table = monthsNumbers.map(month => {
        const element = chain.find(item => item.month === month);
        const oldEl = old.find(item => item.month === month);

        const check = element
            ? isVersionOfMonth(element, oldEl, additions)
            : null;

        if (check === false)
            throw new CanNotFastForwardMonthError(old, chain);

        return {
            month,
            oldEl,
            element,
            check,
        };
    });

    console.log('table');
    console.table(table);

    table.reverse();

    const newChain = table.map(item => item.element || item.oldEl!);

    checkChain(newChain);

    if (newChain[0]!.id !== head.id)
        throw new Error('Invalid Head month');

    return newChain;
}

/**
 * Проверяет является ли element версией oldEl
 * Так же вернет true если element измененная версия oldEl
 * @param element Проверяемый элемент
 * @param oldEl Предполагаемые предок
 * @param additions Дополнительные блоки
 */
export function isVersionOfMonth(element: IMonthBrief, oldEl: IMonthBrief | undefined, additions: ReadonlyArray<IMonthBrief> = []): boolean {
    if (!oldEl)
        return true;

    if (element.month !== oldEl.month)
        return false;

    const items = [oldEl, ...additions];

    if (element.prevVersions.every((id, index) => oldEl.prevVersions[index] === id))
        return true;

    for (; element.id !== oldEl.id;) {
        if (element.prevVersions.length === 0)
            return false;

        if (element.prevVersions.length > 1)
            throw new Error('Я не умею во много предыдущих месяцев');

        const nextId = element.prevVersions[0];

        const next = items.find(item => item.id === nextId);

        if (next)
            element = next;
        else
            throw new RequiredMonthsError(nextId);
    }

    return true;
}

export function findChain(head: IMonthBrief, items: ReadonlyArray<IMonthBrief>): {
    completed: boolean,
    chain: IMonthBrief[],
} {
    const chain: IMonthBrief[] = [];

    let lastBlock: IMonthBrief | undefined = head;
    do {
        chain.push(lastBlock);

        if (lastBlock.prevMonths.length === 0)
            return {
                completed: true,
                chain,
            };

        if (lastBlock.prevMonths.length !== 1)
            throw new Error(`Can not process merged month ${lastBlock.id} (${lastBlock.month}): more then 1 prevMonths`);
        if (lastBlock.prevVersions.length > 1)
            throw new Error(`Can not process merged month ${lastBlock.id} (${lastBlock.month}): more then 1 prevVersions`);

        const nextID = lastBlock.prevMonths[0];
        lastBlock = items.find(item => item.id === nextID);

        if (!lastBlock) {
            return {
                completed: false,
                chain,
            };
        }
    } while (true);
}

function checkChain(chain: ReadonlyArray<IMonthBrief>): boolean {
    if (chain.length === 0) return false;

    for (let i = 0; i < chain.length - 1; i++) {
        const current = chain[i];
        const next = chain[i + 1];
        if (next.month >= current.month)
            throw new MonthChainError(`month must be less then ${current.month}`, chain, next);

        if (!current.prevMonths.length)
            throw new MonthChainError(`unexpected end of chain`, chain, current);

        if (current.prevMonths.length > 1)
            throw new MonthChainError(`can not process month with not 1 prevMonths`, chain, current);

        if (current.prevMonths[0] !== next.id)
            throw new RequiredMonthsError(current.prevMonths[0]);
    }

    // let lastBlock: IMonthBrief | undefined = head;
    // do {
    //     chain.push(lastBlock);
    //
    //     if (lastBlock.prevMonths.length === 0)
    //         return {
    //             completed: true,
    //             chain,
    //         };
    //
    //     if (lastBlock.prevMonths.length !== 1)
    //         throw new Error(`Can not process merged month ${lastBlock.id} (${lastBlock.month}): more then 1 prevMonths`);
    //     if (lastBlock.prevVersions.length > 1)
    //         throw new Error(`Can not process merged month ${lastBlock.id} (${lastBlock.month}): more then 1 prevVersions`);
    //
    //     const nextID = lastBlock.prevMonths[0];
    //     lastBlock = items.find(item => item.id === nextID);
    //
    //     if (!lastBlock) {
    //         return {
    //             completed: false,
    //             chain,
    //         };
    //     }
    // } while (true);
    return true;
}

export class MonthChainError extends Error {
    constructor(public reason: string,
                public chain: ReadonlyArray<IMonthBrief>,
                public invalidMonth: IMonthBrief) {
        super(`Invalid chain: ${reason} at ${invalidMonth.id} (${invalidMonth.month})`);
    }
}

export class RequiredMonthsError extends Error {
    public ids: UUID[];

    constructor(...ids: UUID[]) {
        super(`Required months: ${ids.join(', ')}`);
        this.ids = ids;
    }
}

export class CanNotFastForwardMonthError extends Error {
    constructor(public from: ReadonlyArray<IMonthBrief>,
                public to: ReadonlyArray<IMonthBrief>) {
        super([`Can not fast forward`,
            `from ${from[0].id} (${from[0].month}, length ${from.length})`,
            `to ${to[0].id} (${to[0].month}, length ${to.length})`,
        ].join('\n'));
    }
}
