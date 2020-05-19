import React from 'react';
import { render } from '@testing-library/react';
import { MoneyView } from './MoneyView';

it('renders learn react link', () => {
    const {getByText} = render(<MoneyView/>);
    const linkElement = getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
});
