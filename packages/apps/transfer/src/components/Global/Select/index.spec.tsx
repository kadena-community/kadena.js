import { SystemIcons } from '@kadena/react-components';

import { Select } from './index';

import { getByTestId, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

describe('Select', () => {
  test('renders correctly with all props', () => {
    const handleChange = jest.fn();

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
        leftPanel={SystemIcons.AlertCircleOutline}
        rightPanel={SystemIcons.AlertCircleOutline}
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
    userEvent.selectOptions(select, 'option2');
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('renders correctly with minimal props', () => {
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
