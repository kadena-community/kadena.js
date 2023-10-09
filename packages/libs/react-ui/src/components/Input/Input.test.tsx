import { Input } from '@components/Input';
import { render } from '@testing-library/react';
import React from 'react';

fdescribe('Input', () => {
  test('renders correctly', () => {
    const { getByTestId } = render(<Input id="test-input" />);

    const inputContainer = getByTestId('kda-input');
    expect(inputContainer).toBeInTheDocument();
  });
});
