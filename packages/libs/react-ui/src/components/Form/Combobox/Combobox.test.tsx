import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { Combobox, ComboboxItem } from './Combobox';

import userEvent from '@testing-library/user-event';

// TODO: add more tests
describe('Combobox', () => {
  it('should render without errors', () => {
    render(
      <Combobox aria-label="combobox">
        <ComboboxItem key="1">Option 1</ComboboxItem>
        <ComboboxItem key="2">Option 2</ComboboxItem>
      </Combobox>,
    );

    const combobox = screen.getByRole('combobox', { name: 'combobox' });
    expect(combobox).toBeInTheDocument();
  });

  it('should show options when user start typing', async () => {
    render(
      <Combobox label="label">
        <ComboboxItem key="1">Option 1</ComboboxItem>
        <ComboboxItem key="2">Option 2</ComboboxItem>
      </Combobox>,
    );

    const combobox = screen.getByRole('combobox', { name: 'label' });
    await userEvent.type(combobox, 'Option');
    const option1 = screen.getByRole('option', { name: 'Option 1' });
    const option2 = screen.getByRole('option', { name: 'Option 2' });

    expect(option1).toBeInTheDocument();
    expect(option2).toBeInTheDocument();
  });
});
