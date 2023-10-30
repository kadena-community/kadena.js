import { SystemIcon } from '@kadena/react-ui';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './index';

describe('Select', () => {
  it.skip('renders correctly with all props', async () => {
    const handleChange = vi.fn();

    const { getByTestId } = render(
      <Select
        label="Select Label"
        tag="Tag Text"
        info="Info Text"
        helper="Helper Text"
        status="error"
        disabled={false}
        value="option1"
        leadingText="Leading Text"
        leftPanel={SystemIcon.AlertCircleOutline}
        rightPanel={SystemIcon.AlertCircleOutline}
        onChange={handleChange}
        data-testid="select"
      >
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </Select>,
    );

    // Assert that the Select component is rendered
    const select = getByTestId('select');
    expect(select).toBeInTheDocument();

    // Assert that the Select component has the correct props
    expect(select).toHaveValue('option1');

    // Select an option and trigger change event
    await userEvent.selectOptions(select, 'option2');
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('renders correctly with minimal props', () => {
    const { getByTestId } = render(
      <Select value="option1" data-testid="select">
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </Select>,
    );

    // Assert that the Select component is rendered
    const select = getByTestId('select');
    expect(select).toBeInTheDocument();

    // Assert that the Select component has the correct props
    expect(select).not.toHaveAttribute('aria-label');
    expect(select).toHaveValue('option1');
  });
});
