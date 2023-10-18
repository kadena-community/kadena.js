import { SystemIcon } from '@components/Icon';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import type { ISelectProps } from './Select';
import { Select } from './Select';

const meta: Meta<ISelectProps> = {
  title: 'Form/Select',
  component: Select,
  parameters: {
    docs: {
      description: {
        component:
          'The Select component renders a select element with options. The select element can be disabled with the `disabled` prop. The icon of the select element can be set with the `icon` prop.',
      },
    },
  },
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
        <option value={'1'}>option 1</option>
        <option value={'2'}>option 2</option>
      </Select>
    );
  },
};
