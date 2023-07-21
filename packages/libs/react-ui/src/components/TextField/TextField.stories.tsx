import { SystemIcon } from '@components/Icon';
import { IInputProps } from '@components/Input';
import { statusVariant } from '@components/InputWrapper/InputWrapper.css';
import { ITextFieldProps, TextField } from '@components/TextField';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<
  {
    helperText: string;
    leadingText: string;
    leftIcon: keyof typeof SystemIcon;
    rightIcon: keyof typeof SystemIcon;
  } & ITextFieldProps
> = {
  title: 'Components/TextField',
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
    helperText: {
      control: {
        type: 'text',
      },
    },
    leadingText: {
      control: {
        type: 'text',
      },
    },
    status: {
      options: [
        undefined,
        ...(Object.keys(statusVariant) as (keyof typeof statusVariant)[]),
      ],
      control: {
        type: 'select',
      },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
    },
    leftIcon: {
      options: Object.keys(SystemIcon) as (keyof typeof SystemIcon)[],
      control: {
        type: 'select',
      },
    },
    rightIcon: {
      options: Object.keys(SystemIcon) as (keyof typeof SystemIcon)[],
      control: {
        type: 'select',
      },
    },
  },
};

export default meta;
type Story = StoryObj<
  {
    helperText: string;
    leadingText: string;
    leftIcon: keyof typeof SystemIcon;
    rightIcon: keyof typeof SystemIcon;
  } & ITextFieldProps &
    Omit<IInputProps, 'leftIcon' | 'rightIcon'>
>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/react/api/csf
 * to learn how to use render functions.
 */

export const Group: Story = {
  name: 'Text Field',
  args: {
    tag: 'tag',
    helperText: 'This is helper text',
    info: '(optional)',
    label: 'Label',
    disabled: false,
    status: undefined,
    leftIcon: 'Account',
    rightIcon: undefined,
    leadingText: 'Leading',
  },
  render: ({
    leadingText,
    leftIcon,
    rightIcon,
    onChange,
    disabled,
    status,
    tag,
    helperText,
    info,
    label,
  }) => {
    return (
      <TextField
        tag={tag}
        info={info}
        label={label}
        status={status}
        disabled={disabled}
        helperText={helperText}
        inputProps={{
          id: 'inputStory',
          leadingText,
          leftIcon: SystemIcon[leftIcon],
          rightIcon: SystemIcon[rightIcon],
          onChange,
          placeholder: 'This is a placeholder',
        }}
      />
    );
  },
};
