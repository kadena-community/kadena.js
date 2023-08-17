import { Option } from './Option';
import type { ISelectProps } from './Select';
import { Select } from './Select';

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
  render: ({ icon, disabled }) => {
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
      >
        <Option value={'1'}>option 1</Option>
        <Option value={'2'}>option 2</Option>
      </Select>
    );
  },
};
