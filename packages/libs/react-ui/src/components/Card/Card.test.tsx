import { Card } from '@components/Card';
import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, test } from 'vitest';

describe('Card', () => {
  test('renders correctly', () => {
    const { getByTestId } = render(<Card>Hello, Card!</Card>);

    const cardContainer = getByTestId('kda-card');
    expect(cardContainer).toBeInTheDocument();
  });
});
