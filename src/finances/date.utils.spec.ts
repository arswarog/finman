import { parseDayDate, parseMonthDate } from './date.utils';

describe('date utils', () => {
    describe('parseMonthDate', () => {
        it('2020-10', () => {
            const date = parseMonthDate('2020-10');
            expect(date).toEqual(new Date(2020, 9, 1, 0, 0, 0));
        });
        it('invalid "2020-1"', () => {
            expect(() => parseMonthDate('2020-1'))
                .toThrowError();
        });
        it('invalid "2020-25"', () => {
            expect(() => parseMonthDate('2020-25'))
                .toThrowError();
        });
        it('invalid "asdhas"', () => {
            expect(() => parseMonthDate('asdhas'))
                .toThrowError();
        });
    });
    describe('parseDayDate', () => {
        it('2020-10-07', () => {
            const date = parseDayDate('2020-10-07');
            expect(date).toEqual(new Date(2020, 9, 7, 0, 0, 0));
        });
        it('invalid "2020-1-1"', () => {
            expect(() => parseDayDate('2020-1-1'))
                .toThrowError();
        });
        it('invalid "2020-12-45"', () => {
            expect(() => parseDayDate('2020-12-45'))
                .toThrowError();
        });
        it('invalid "asdhas"', () => {
            expect(() => parseDayDate('asdhas'))
                .toThrowError();
        });
    });
});
