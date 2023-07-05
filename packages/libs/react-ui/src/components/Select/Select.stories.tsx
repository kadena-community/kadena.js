import { SystemIcon } from '../Icons';

import { Option } from './Option';
import { ISelectProps, Select } from './Select';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<
  {
    icon: keyof typeof SystemIcon;
  } & ISelectProps
> = {
  title: 'Components/Select',
  argTypes: {
    disabled: {
      control: {
        type: 'boolean',
      },
    },
    icon: {
      options: [
        undefined,
        ...(Object.keys(SystemIcon) as (keyof typeof SystemIcon)[]),
      ],
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
  render: ({ icon, disabled }) => (
    <Select
      icon={SystemIcon[icon]}
      onChange={(value) => {
        console.log('clicked on', value);
      }}
      disabled={Boolean(disabled)}
      value={1}
    >
      <Option value={1}>option 1</Option>
      <Option value={2}>option 2</Option>
    </Select>
  ),
};
