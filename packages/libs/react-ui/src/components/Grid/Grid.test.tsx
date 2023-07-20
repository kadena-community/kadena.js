import { Grid } from '@components/Grid';
import { render } from '@testing-library/react';
import React from 'react';

describe('Grid', () => {
  test('root renders correctly', () => {
    const { getByTestId } = render(<Grid.Root>Hello, Grid!</Grid.Root>);

    const cardContainer = getByTestId('kda-grid-root');
    expect(cardContainer).toBeInTheDocument();
  });

  test('item renders correctly', () => {
    const { getByTestId } = render(<Grid.Item>Hello, Grid!</Grid.Item>);

    const cardContainer = getByTestId('kda-grid-item');
    expect(cardContainer).toBeInTheDocument();
  });
});
