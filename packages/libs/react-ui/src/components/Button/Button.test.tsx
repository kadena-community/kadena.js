import { Button } from '@components/Button';
import { render } from '@testing-library/react';
import React from 'react';

describe('Button', () => {
  test('renders correctly', () => {
    const { getByTestId } = render(
      <Button title="button">Hello, Button!</Button>,
    );

    const buttonContainer = getByTestId('kda-button');
    expect(buttonContainer).toBeInTheDocument();
  });
});
