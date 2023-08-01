import { statusVariant } from './InputWrapper.css';

import { SystemIcon } from '@components/Icon';
import { IInputProps, Input } from '@components/Input';
import { IInputWrapperProps, InputWrapper } from '@components/InputWrapper';
import type { Meta, StoryObj } from '@storybook/react';
import { vars } from '@theme/vars.css';
import React from 'react';

const meta: Meta<
  {
    helperText: string;
    leadingText: string;
    leftIcon: keyof typeof SystemIcon;
    rightIcon: keyof typeof SystemIcon;
  } & IInputWrapperProps
> = {
  title: 'Components/InputWrapper',
  argTypes: {
    label: {
      control: {
        type: 'text',
      },
    },
    leadingTextWidth: {
      control: {
        type: 'select',
      },
      options: [
        undefined,
        ...Object.keys(vars.sizes).map((key) => key as keyof typeof vars.sizes),
      ],
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
  },
};

export default meta;
type Story = StoryObj<
  {
    helperText: string;
    leadingText: string;
  } & IInputWrapperProps &
    Omit<IInputProps, 'leftIcon' | 'rightIcon'>
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
    leadingTextWidth: undefined,
    disabled: false,
    status: undefined,
  },
  render: ({
    disabled,
    status,
    tag,
    helperText,
    info,
    label,
    leadingTextWidth,
  }) => {
    return (
      <InputWrapper
        tag={tag}
        info={info}
        label={label}
        leadingTextWidth={leadingTextWidth}
        status={status}
        disabled={disabled}
        helperText={helperText}
        htmlFor="inputStory"
      >
        <Input
          id="inputStory"
          placeholder="Input 1"
          disabled={disabled}
          leadingText="Leading"
        />
        <Input
          id="inputStory2"
          placeholder="Input 2"
          disabled={disabled}
          leadingText="Leading 2"
        />
      </InputWrapper>
    );
  },
};
