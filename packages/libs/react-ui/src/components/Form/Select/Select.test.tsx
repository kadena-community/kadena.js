import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Select, SelectItem } from '../Select';

import userEvent from '@testing-library/user-event';

// TODO: add more tests

describe('Select', () => {
  it('renders without errors', () => {
    render(
      <Select id="select-without-errors" selectedKey="1" aria-label="select">
        <SelectItem key="1">Option 1</SelectItem>
        <SelectItem key="2">Option 2</SelectItem>
      </Select>,
    );

    const selectField = screen.getByLabelText('select');
    expect(selectField).toBeInTheDocument();
  }, 20000);

  it('renders the provided children options when is open', async () => {
    render(
      <Select id="renders-child-options" selectedKey="1" aria-label="select">
        <SelectItem key="1">Option 1</SelectItem>
        <SelectItem key="2">Option 2</SelectItem>
      </Select>,
    );

    const select = screen.getByLabelText('select');
    await userEvent.click(select);
    const option1 = screen.getByRole('option', {
      name: 'Option 1',
    });
    const option2 = screen.getByRole('option', {
      name: 'Option 2',
    });

    expect(option1).toBeInTheDocument();
    expect(option2).toBeInTheDocument();
  }, 20000);

  it('invokes the onChange event handler when an option is selected', async () => {
    const handleChange = vi.fn();
    render(
      <Select
        id="on-change-select"
        selectedKey="1"
        onSelectionChange={handleChange}
        aria-label="select"
      >
        <SelectItem key="1">Option 1</SelectItem>
        <SelectItem key="2">Option 2</SelectItem>
      </Select>,
    );

    const selectContainer = screen.getByLabelText('select');
    await userEvent.click(selectContainer);
    await userEvent.click(screen.getByRole('option', { name: 'Option 2' }));
    expect(handleChange).toHaveBeenCalledTimes(1);
  }, 20000);

  it('disables the select element when disabled prop is true', () => {
    render(
      <Select selectedKey="1" isDisabled label="Cool label">
        <SelectItem key="1">Option 1</SelectItem>
        <SelectItem key="2">Option 2</SelectItem>
      </Select>,
    );

    const selectButton = screen.getByRole('button') as HTMLButtonElement;
    expect(selectButton.disabled).toBe(true);
  }, 20000);
});
