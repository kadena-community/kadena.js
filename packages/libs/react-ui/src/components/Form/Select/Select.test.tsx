import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Select, SelectItem } from '../Select';

describe('Select', () => {
  it('renders without errors', () => {
    const { getByLabelText } = render(
      <Select id="select-without-errors" selectedKey="1" aria-label="select">
        <SelectItem key="1">Option 1</SelectItem>
        <SelectItem key="2">Option 2</SelectItem>
      </Select>,
    );

    const selectField = getByLabelText('select');
    expect(selectField).toBeInTheDocument();
  });

  it('renders the provided children options', () => {
    const { getByLabelText } = render(
      <Select id="renders-child-options" selectedKey="1" aria-label="select">
        <SelectItem key="1">Option 1</SelectItem>
        <SelectItem key="2">Option 2</SelectItem>
      </Select>,
    );

    const selectField = getByLabelText('select');
    const option1 = selectField.querySelector('option[value="1"]');
    const option2 = selectField.querySelector('option[value="2"]');

    expect(option1).toBeInTheDocument();
    expect(option2).toBeInTheDocument();
  });

  it('invokes the onChange event handler when an option is selected', () => {
    const handleChange = vi.fn();
    const { getByLabelText } = render(
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

    const selectContainer = getByLabelText('select');
    const selectElement = selectContainer.querySelector(
      'select',
    ) as HTMLSelectElement;

    fireEvent.change(selectElement, { target: { value: '2' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('disables the select element when disabled prop is true', () => {
    const { getByLabelText } = render(
      <Select id="disabled-select" selectedKey="1" disabled aria-label="select">
        <SelectItem key="1">Option 1</SelectItem>
        <SelectItem key="2">Option 2</SelectItem>
      </Select>,
    );

    const selectContainer = getByLabelText('select');
    const selectElement = selectContainer.querySelector(
      'select',
    ) as HTMLSelectElement;

    expect(selectElement.disabled).toBe(true);
  });
});
