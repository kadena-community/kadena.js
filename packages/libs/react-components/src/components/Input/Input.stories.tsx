import { SystemIcons } from './../../';
import type { IInputProps } from '.';
import { Input } from '.';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<
  {
    rightPanelIcon: keyof typeof SystemIcons;
    leftPanelIcon: keyof typeof SystemIcons;
    leadingText: string;
  } & IInputProps
> = {
  title: 'Input',
  argTypes: {
    onChange: { action: 'changed' },
    leadingText: {
      control: {
        type: 'text',
      },
    },
    leftPanelIcon: {
      options: Object.keys(SystemIcons) as (keyof typeof SystemIcons)[],
      control: {
        type: 'select',
      },
    },
    rightPanelIcon: {
      options: Object.keys(SystemIcons) as (keyof typeof SystemIcons)[],
      control: {
        type: 'select',
      },
    },
    status: {
      options: ['success', 'error'],
      control: {
        type: 'select',
      },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
    },
  },
};

export default meta;
type Story = StoryObj<
  {
    leadingText: string;
    leftPanelIcon: keyof typeof SystemIcons;
    rightPanelIcon: keyof typeof SystemIcons;
  } & IInputProps
>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/react/api/csf
 * to learn how to use render functions.
 */

export const Primary: Story = {
  name: 'Input',
  args: {
    leadingText: undefined,
    leftPanelIcon: undefined,
    rightPanelIcon: undefined,
    disabled: false,
    status: undefined,
  },
  render: ({
    leadingText,
    leftPanelIcon,
    rightPanelIcon,
    onChange,
    disabled,
    status,
  }) => {
    return (
      <Input
        onChange={onChange}
        leadingText={leadingText}
        leftPanel={SystemIcons[leftPanelIcon]}
        rightPanel={SystemIcons[rightPanelIcon]}
        disabled={disabled}
        placeholder={'This is a placeholder'}
        status={status}
      />
    );
  },
};
