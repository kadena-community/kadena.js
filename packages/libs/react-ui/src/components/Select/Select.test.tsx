import { Select } from '@components/Select';
import { Option } from '@components/Select/Option';
import { render } from '@testing-library/react';
import React from 'react';

describe('Select', () => {
  test('renders correctly', () => {
    const { getByTestId } = render(
      <Select onChange={() => {}} value={1}>
        <Option value={1}>option 1</Option>
      </Select>,
    );

    const inputContainer = getByTestId('kda-select');
    expect(inputContainer).toBeInTheDocument();
  });
});
