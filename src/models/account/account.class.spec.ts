import { Account, RequiredMonthsError } from './account.class';
import { Money } from '../money/money.class';
import { Month } from '../month/month.class';
import { month1 } from '../month/month.class.spec';

describe('Account class', () => {
    describe('updateMonth', () => {
        it('add first month', () => {
            // arrange
            const baseAccount = Account.create('test');
            const month = month1(baseAccount.id);

            // act
            const account = baseAccount.updateMonth(month);

            // assert
            expect(account).toHaveProperty('balance', Money.from(month.summary.balance));
            expect(account).toHaveProperty('income', Money.from(month.summary.income));
            expect(account).toHaveProperty('expense', Money.from(month.summary.expense));
        });
    });
    describe('recalculate', () => {
        it('no months', () => {
            // arrange
            const account = Account.create('test');

            // act
            const result = account.recalculate();

            // assert
            expect(result).toHaveProperty('balance', Money.empty);
            expect(result).toHaveProperty('income', Money.empty);
            expect(result).toHaveProperty('expense', Money.empty);
        });
        it('1 month', () => {
            // arrange
            const account = Account.create('test');
            const month = Month.createFirstBlock(account.id, '2020-05', 1415124234);
            account.updateMonth(month);

            // act
            const result = account.recalculate();

            // assert
            expect(result).toHaveProperty('balance', Money.empty);
            expect(result).toHaveProperty('income', Money.empty);
            expect(result).toHaveProperty('expense', Money.empty);
        });
    });
});
