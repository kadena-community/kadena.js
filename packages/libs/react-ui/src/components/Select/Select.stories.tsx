import { Option } from './Option';
import { ISelectProps, Select, variants } from './Select';

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
    variant: {
      description: 'switch between style variants',
      control: {
        type: 'select',
      },
      table: {
        type: { summary: 'select' },
        defaultValue: { summary: 'default' },
      },
      options: variants,
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
    variant: 'default' | 'form';
  } & Omit<ISelectProps, 'icon'>
>;

export const Dynamic: Story = {
  name: 'Select',
  args: {
    icon: undefined,
  },
  render: ({ icon, disabled, variant = 'default' }) => {
    const [value, setValue] = useState<string>('1');
    return (
      <Select
        ariaLabel={'select'}
        icon={SystemIcon[icon]}
        onChange={(e) => {
          console.log('clicked on', e.target.value);
          setValue(e.target.value);
        }}
        disabled={Boolean(disabled)}
        value={value}
        variant={variant}
      >
        <Option value={'1'}>option 1</Option>
        <Option value={'2'}>option 2</Option>
      </Select>
    );
  },
};
