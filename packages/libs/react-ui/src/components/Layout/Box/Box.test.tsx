import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, test } from 'vitest';

import { Box } from './Box';

describe('Box', () => {
  test('renders a box', () => {
    render(<Box>Box</Box>);
    expect(screen.getByText('Box')).toBeInTheDocument();
  });
});
