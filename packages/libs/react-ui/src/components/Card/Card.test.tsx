import { Card } from '@components/Card';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, test } from 'vitest';

describe('Card', () => {
  test('renders correctly', () => {
    render(<Card>Hello, Card!</Card>);

    expect(screen.getByText('Hello, Card!')).toBeInTheDocument();
  });
});
