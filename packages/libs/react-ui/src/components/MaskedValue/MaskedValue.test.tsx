import { MaskedValue } from '@components/MaskedValue';
import { render } from '@testing-library/react';
import React from 'react';

describe('MaskedValue', () => {
  test('renders correctly', () => {
    const { getByTestId } = render(<MaskedValue value="TestValue1234" />);

    const maskedValue = getByTestId('kda-masked-value');
    expect(maskedValue).toBeInTheDocument();
  });
});
