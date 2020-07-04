import { BarColor, prepareButtonData } from './DetailsMainButton';

describe('DetailsMainButton', () => {
    describe('prepareButtonData', () => {
        describe('moreIsBetter', () => {
            it('1.53', () => {
                const result = prepareButtonData({
                    percent: 1.53,
                    moreIsBetter: true,
                });
                expect(result).toEqual({
                    percentDiff: '+53%',
                    barBgColor: BarColor.Good,
                    barColor: BarColor.Normal,
                    barWidth: 65,
                });
            });
            it('1.005', () => {
                const result = prepareButtonData({
                    percent: 1.005,
                    moreIsBetter: true,
                });
                expect(result).toEqual({
                    percentDiff: '+0%',
                    barBgColor: BarColor.Good,
                    barColor: BarColor.Normal,
                    barWidth: 99,
                });
            });
            it('0.83', () => {
                const result = prepareButtonData({
                    percent: 0.83,
                    moreIsBetter: true,
                });
                expect(result).toEqual({
                    percentDiff: '-17%',
                    barBgColor: BarColor.Neutral,
                    barColor: BarColor.Bad,
                    barWidth: 83,
                });
            });
        });
        describe('lessIsBetter', () => {
            it('1.3', () => {
                const result = prepareButtonData({
                    percent: 1.3,
                    lessIsBetter: true,
                });
                expect(result).toEqual({
                    percentDiff: '+30%',
                    barBgColor: BarColor.Normal,
                    barColor: BarColor.Bad,
                    barWidth: 76,
                });
            });
            it('0.94', () => {
                const result = prepareButtonData({
                    percent: 0.94,
                    lessIsBetter: true,
                });
                expect(result).toEqual({
                    percentDiff: '-6%',
                    barBgColor: BarColor.Neutral,
                    barColor: BarColor.Normal,
                    barWidth: 94,
                });
            });
            it('0.4', () => {
                const result = prepareButtonData({
                    percent: 0.4,
                    lessIsBetter: true,
                });
                expect(result).toEqual({
                    percentDiff: '-60%',
                    barBgColor: BarColor.Neutral,
                    barColor: BarColor.Good,
                    barWidth: 40,
                });
            });
        });
    });
});
