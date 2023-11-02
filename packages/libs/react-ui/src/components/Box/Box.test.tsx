import { Box } from '@components/Box';
import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, test } from 'vitest';

describe('Box', () => {
  test('renders correctly', () => {
    const { getByTestId } = render(<Box>Hello, Box!</Box>);

    const boxContainer = getByTestId('kda-box');
    expect(boxContainer).toBeInTheDocument();
  });
});
