import { SystemIcon } from '../Icons';

import { IInputFieldProps, InputField } from './InputField/InputField';
import { IInputHeaderProps, InputHeader } from './InputHeader/InputHeader';
import { InputHelper } from './InputHelper/InputHelper';
import { IInputWrapperProps, InputWrapper } from './InputWrapper/InputWrapper';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<
  {
    helperText: string;
    leftIcon: keyof typeof SystemIcon;
    rightIcon: keyof typeof SystemIcon;
  } & IInputHeaderProps &
    IInputWrapperProps
> = {
  title: 'Components/Input',
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
    status: {
      options: [undefined, 'success', 'error'],
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
    leftIcon: keyof typeof SystemIcon;
    rightIcon: keyof typeof SystemIcon;
  } & IInputHeaderProps &
    IInputWrapperProps
>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/react/api/csf
 * to learn how to use render functions.
 */

export const Group: Story = {
  name: 'Input Group',
  args: {
    tag: 'tag',
    helperText: 'This is helper text',
    info: '(optional)',
    label: 'Label',
    disabled: false,
    status: undefined,
    leftIcon: undefined,
    rightIcon: undefined,
  },
  render: ({
    tag,
    helperText,
    info,
    label,
    disabled,
    status,
    leftIcon,
    rightIcon,
  }) => {
    const hasHeader = Boolean(tag) || Boolean(label) || Boolean(info);

    return (
      <InputWrapper status={status} disabled={disabled}>
        {hasHeader && (
          <InputHeader
            htmlFor="testInput"
            label={label}
            tag={tag}
            info={info}
          />
        )}
        <div>
          <InputField
            id="testInput"
            leadingText="Leading"
            placeholder={'This is a placeholder'}
            disabled={disabled}
            leftIcon={SystemIcon[leftIcon]}
            rightIcon={SystemIcon[rightIcon]}
          />
        </div>
        {helperText && <InputHelper>{helperText}</InputHelper>}
      </InputWrapper>
    );
  },
};
