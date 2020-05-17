import { ITransaction, TransactionType } from './transaction.types';
import { IExtendSummary, ISummary } from './common.types';
import { Money } from './money.class';

export function calculateSummary(transactions: ITransaction[]): ISummary {
    let [expense, income] = transactions.reduce(
        ([expense, income], tx) => {
            switch (tx.type) {
                case TransactionType.Removed:
                    return [expense, income];
                case TransactionType.Income:
                    return [
                        expense,
                        income.add(tx.amount),
                    ];
                case TransactionType.Expense:
                    return [
                        expense.add(tx.amount),
                        income,
                    ];
                default:
                    throw new Error(`Can't process type "${TransactionType[tx.type]}"`);
            }
        },
        [Money.empty, Money.empty],
    );

    const balance = income.sub(expense);

    return {
        balance,
        expense,
        income,
    };
}

export function calculateExtendSummary(transactions: ITransaction[]): IExtendSummary {
    let balanceOnStart = Money.empty;
    let balanceOnEnd = Money.empty;

    const summary = calculateSummary(transactions);

    return {
        ...summary,
        balanceOnStart,
        balanceOnEnd: balanceOnStart.add(summary.balance),
    };
}

export function addSummary(base: ISummary, add: ISummary): ISummary {
    const balance = base.balance.add(add.balance);
    const expense = base.expense.add(add.expense);
    const income = base.income.add(add.income);
    if (!income.sub(expense).equal(balance)) {
        if (!checkSummary(base))
            throw new Error(`"Base" summary invalid`);
        if (!checkSummary(add))
            throw new Error(`"Add" summary invalid`);
        throw new Error(`Incorrect balance`);
    }
    return {
        balance,
        expense,
        income,
    };
}

export function addExtendSummary(base: IExtendSummary, add: ISummary): IExtendSummary {
    const summary = addSummary(base, add);
    const balanceOnStart = base.balanceOnStart;
    const balanceOnEnd = base.balanceOnEnd.add(add.balance);
    if (!summary.income.sub(summary.expense).equal(summary.balance)) {
        if (!checkExtendSummary(base))
            throw new Error(`"Base" summary invalid`);
        if (!checkSummary(add))
            throw new Error(`"Add" summary invalid`);
        throw new Error(`Incorrect balance`);
    }
    return {
        ...summary,
        balanceOnStart,
        balanceOnEnd,
    };
}

export function checkSummary(summary: ISummary): boolean {
    const balance = summary.income.sub(summary.expense);
    return balance.equal(summary.balance);
}

export function checkExtendSummary(summary: IExtendSummary): boolean {
    if (!checkSummary(summary))
        return false;
    const balance = summary.income.sub(summary.expense);
    const balanceOnEnd = summary.balanceOnStart.add(balance);
    return balanceOnEnd.equal(summary.balanceOnEnd);
}
