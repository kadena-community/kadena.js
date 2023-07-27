import { Button } from '@components/Button';
import { SystemIcon } from '@components/Icon';
import { IInputProps, Input } from '@components/Input';
import { Stack } from '@components/Stack';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<
  {
    leftIcon: keyof typeof SystemIcon;
  } & IInputProps
> = {
  title: 'Components/Input',
  argTypes: {
    disabled: {
      control: {
        type: 'boolean',
      },
    },
    leftIcon: {
      options: [
        undefined,
        ...(Object.keys(SystemIcon) as (keyof typeof SystemIcon)[]),
      ],
      control: {
        type: 'select',
      },
    },
    rightIcon: {
      options: [
        undefined,
        ...(Object.keys(SystemIcon) as (keyof typeof SystemIcon)[]),
      ],
      control: {
        type: 'select',
      },
    },
    leadingText: {
      control: {
        type: 'text',
      },
    },
    outlined: {
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
    leftIcon: keyof typeof SystemIcon;
    rightIcon: keyof typeof SystemIcon;
  } & Omit<IInputProps, 'leftIcon' | 'rightIcon'>
>;

export const Dynamic: Story = {
  name: 'Input',
  args: {
    leftIcon: undefined,
    rightIcon: undefined,
    leadingText: 'Leading',
    outlined: false,
  },
  render: ({
    leftIcon,
    rightIcon,
    outlined,
    leadingText,
    onChange,
    disabled,
  }) => (
    <Input
      id="inlineInputStory"
      leftIcon={SystemIcon[leftIcon]}
      rightIcon={SystemIcon[rightIcon]}
      onChange={onChange}
      placeholder="This is a placeholder"
      leadingText={leadingText}
      outlined={outlined}
      disabled={disabled}
    />
  ),
};

export const InlineWithButton: Story = {
  name: 'Inline with button',
  args: {
    leftIcon: undefined,
  },
  render: ({ leftIcon, onChange }) => (
    <Stack spacing="$xs" alignItems="stretch">
      <Input
        id="inlineInputStory"
        leftIcon={SystemIcon[leftIcon]}
        onChange={onChange}
        placeholder="This is a placeholder"
        outlined
      />
      <Button title="Submit" onClick={() => {}}>
        Submit
      </Button>
    </Stack>
  ),
};
