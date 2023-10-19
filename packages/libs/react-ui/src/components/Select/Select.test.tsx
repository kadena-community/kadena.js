import { Select } from '@components/Select';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';

describe('Select', () => {
  it('renders without errors', () => {
    const { getByTestId } = render(
      <Select
        id="select-without-errors"
        value="1"
        onChange={() => {}}
        ariaLabel="select"
      >
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>,
    );

    const selectContainer = getByTestId('kda-select');
    expect(selectContainer).toBeInTheDocument();
  });

  it('renders the provided children options', () => {
    const { getByTestId } = render(
      <Select
        id="renders-child-options"
        value="1"
        onChange={() => {}}
        ariaLabel="select"
      >
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>,
    );

    const selectContainer = getByTestId('kda-select');
    const selectElement = selectContainer.querySelector('select');
    const option1 = selectContainer.querySelector('option[value="1"]');
    const option2 = selectContainer.querySelector('option[value="2"]');

    expect(selectElement).toBeInTheDocument();
    expect(option1).toBeInTheDocument();
    expect(option2).toBeInTheDocument();
  });

  it('invokes the onChange event handler when an option is selected', () => {
    const handleChange = vi.fn();
    const { getByTestId } = render(
      <Select
        id="on-change-select"
        value="1"
        onChange={handleChange}
        ariaLabel="select"
      >
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>,
    );

    const selectContainer = getByTestId('kda-select');
    const selectElement = selectContainer.querySelector(
      'select',
    ) as HTMLSelectElement;

    fireEvent.change(selectElement, { target: { value: '2' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('disables the select element when disabled prop is true', () => {
    const { getByTestId } = render(
      <Select
        id="disabled-select"
        value="1"
        onChange={() => {}}
        disabled
        ariaLabel="select"
      >
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>,
    );

    const selectContainer = getByTestId('kda-select');
    const selectElement = selectContainer.querySelector(
      'select',
    ) as HTMLSelectElement;

    expect(selectElement.disabled).toBe(true);
  });
});
