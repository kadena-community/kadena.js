import { Grid } from '@components/Layout/Grid';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, test } from 'vitest';

describe('Grid', () => {
  test('root renders correctly', () => {
    render(<Grid.Root>Hello, Grid Root!</Grid.Root>);

    expect(screen.getByText('Hello, Grid Root!')).toBeInTheDocument();
  });

  test('item renders correctly', () => {
    render(<Grid.Item>Hello, Grid Item!</Grid.Item>);

    expect(screen.getByText('Hello, Grid Item!')).toBeInTheDocument();
  });
});
