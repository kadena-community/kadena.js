import { Option } from './Option';
import { type ISelectProps, Select } from './Select';

import { SystemIcon } from '@components/Icon';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

const meta: Meta<
  {
    icon: keyof typeof SystemIcon;
  } & ISelectProps
> = {
  title: 'Components/Select',
  argTypes: {
    disabled: {
      description: 'toggle disabled state of component',
      control: {
        type: 'boolean',
        defaultValue: false,
      },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    icon: {
      options: [
        ...['-'],
        ...Object.keys(SystemIcon),
      ] as (keyof typeof SystemIcon)[],
      control: {
        type: 'select',
      },
    },
  },
};

export default meta;
type Story = StoryObj<
  {
    icon: keyof typeof SystemIcon;
  } & Omit<ISelectProps, 'icon'>
>;

export const Dynamic: Story = {
  name: 'Select',
  args: {
    icon: undefined,
  },
  render: ({ icon, disabled }) => {
    const [value, setValue] = useState<string>('1');
    return (
      <Select
        id="select-story"
        ariaLabel={'select'}
        icon={icon}
        onChange={(e) => {
          console.log('clicked on', e.target.value);
          setValue(e.target.value);
        }}
        disabled={Boolean(disabled)}
        value={value}
      >
        <Option value={'1'}>option 1</Option>
        <Option value={'2'}>option 2</Option>
      </Select>
    );
  },
};
