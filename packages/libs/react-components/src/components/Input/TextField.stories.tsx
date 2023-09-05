import { Button, Stack, SystemIcons } from './../../';
import type { IInputGroupProps, IInputProps } from '.';
import { TextField } from './TextField';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<
  {
    rightPanelIcon: keyof typeof SystemIcons;
    leftPanelIcon: keyof typeof SystemIcons;
    leadingText: string;
  } & IInputProps &
    IInputGroupProps
> = {
  title: 'Text Field',
  argTypes: {
    label: {
      control: {
        type: 'text',
      },
    },
    tag: {
      control: {
        type: 'text',
      },
    },
    info: {
      control: {
        type: 'text',
      },
    },
    helper: {
      control: {
        type: 'text',
      },
    },
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
    tag: string;
    helper: string;
    info: string;
    label: string;
  } & IInputProps &
    IInputGroupProps
>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/react/api/csf
 * to learn how to use render functions.
 */

export const Primary: Story = {
  name: 'Text Field',
  args: {
    leadingText: undefined,
    leftPanelIcon: undefined,
    rightPanelIcon: undefined,
    disabled: false,
    status: undefined,
    tag: 'tag',
    helper: 'This is helper text',
    info: '(optional)',
    label: 'Label',
  },
  render: ({
    leadingText,
    leftPanelIcon,
    rightPanelIcon,
    onChange,
    disabled,
    status,
    tag,
    helper,
    info,
    label,
  }) => (
    <TextField
      disabled={disabled}
      status={status}
      label={label}
      info={info}
      tag={tag}
      helper={helper}
      inputProps={{
        leadingText,
        leftPanel: SystemIcons[leftPanelIcon],
        rightPanel: SystemIcons[rightPanelIcon],
        onChange,
        placeholder: 'This is a placeholder',
      }}
    />
  ),
};

export const InlineWithButton: Story = {
  name: 'Inline with button',
  args: {
    leftPanelIcon: undefined,
    label: 'Label',
  },
  render: ({ leftPanelIcon, label, onChange }) => (
    <Stack>
      <TextField
        inputProps={{
          leftPanel: SystemIcons[leftPanelIcon],
          onChange,
          placeholder: 'This is a placeholder',
          'aria-label': label,
        }}
      />
      <Button title="Submit" onClick={() => {}}>
        Submit
      </Button>
    </Stack>
  ),
};
