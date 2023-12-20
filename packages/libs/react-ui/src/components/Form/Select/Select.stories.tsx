import { SystemIcon } from '@components/Icon';
import { onLayer2, withContentWidth } from '@storyDecorators';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import type { ISelectProps } from './Select';
import { Select } from './Select';

const meta: Meta<ISelectProps> = {
  title: 'Form/Select',
  component: Select,
  decorators: [withContentWidth, onLayer2],
  parameters: {
    status: { type: 'inDevelopment' },
    docs: {
      description: {
        component:
          'The Select component renders a select element with options. The select element can be disabled with the `disabled` prop. The startIcon of the select element can be set with the `startIcon` prop.',
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
    startIcon: {
      options: ['-', ...Object.keys(SystemIcon)],
      control: {
        type: 'select',
      },
    },
  },
};

export default meta;
type Story = StoryObj<
  {
    startIcon: React.ReactElement | '-';
  } & Omit<ISelectProps, 'startIcon'>
>;

export const Dynamic: Story = {
  name: 'Select',
  args: {
    startIcon: undefined,
  },
  render: ({ startIcon, disabled, outlined }) => {
    const [value, setValue] = useState<string>('1');
    const IconComponent =
      startIcon !== '-'
        ? SystemIcon[startIcon as unknown as keyof typeof SystemIcon]
        : undefined;

    return (
      <Select
        id="select-story"
        ariaLabel={'select'}
        startIcon={IconComponent && <IconComponent />}
        onChange={(e) => {
          console.log('clicked on', e.target.value);
          setValue(e.target.value);
        }}
        disabled={Boolean(disabled)}
        outlined={Boolean(outlined)}
        value={value}
      >
        <option value={'1'}>option 1</option>
        <option value={'2'}>option 2</option>
      </Select>
    );
  },
};
