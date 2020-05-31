import React from 'react';
import { render } from '@testing-library/react';
import { MoneyView } from './MoneyView';
import { Money } from '../models/money/money.class';

it('renders learn react link', () => {
    const {getByText} = render(<MoneyView money={Money.empty}/>);
    // const linkElement = getByText(/RUB/i);
    // expect(linkElement).toBeInTheDocument();
});
