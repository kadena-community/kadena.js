import { Button } from '@components/Button';
import { render } from '@testing-library/react';
import React from 'react';

describe('Button', () => {
  test('renders correctly', () => {
    const { getByTestId } = render(
      <Button.Root title="Button">Hello, Button!</Button.Root>,
    );

    const buttonContainer = getByTestId('kda-button');
    expect(buttonContainer).toBeInTheDocument();
  });
});
