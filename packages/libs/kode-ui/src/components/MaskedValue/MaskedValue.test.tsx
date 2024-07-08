import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, test } from 'vitest';
import { MaskedValue } from '../MaskedValue';

describe('MaskedValue', () => {
  test('renders correctly', () => {
    const { getByTestId } = render(<MaskedValue value="TestValue1234" />);

    const maskedValue = getByTestId('kda-masked-value');
    expect(maskedValue).toBeInTheDocument();
  });

  test('shows masked value by default', () => {
    render(<MaskedValue value="TestValue1234" />);

    expect(screen.getByText('TestVa***1234')).toBeInTheDocument();
  });

  test('shows correct masked value when non default characters set', () => {
    render(
      <MaskedValue
        value="TestValue1234"
        startUnmaskedValues={1}
        endUnmaskedValues={3}
      />,
    );

    expect(screen.getByText('T****234')).toBeInTheDocument();
  });

  test('shows correct unmasked value', () => {
    render(<MaskedValue value="TestValue1234" defaultVisibility={true} />);

    expect(screen.getByText('TestValue1234')).toBeInTheDocument();
  });

  test('shows unmasked value when unmasked characters are greater or equal than value size', () => {
    render(
      <MaskedValue
        value="TestValue1234"
        startUnmaskedValues={8}
        endUnmaskedValues={5}
      />,
    );

    expect(screen.getByText('TestValue1234')).toBeInTheDocument();
  });
});
