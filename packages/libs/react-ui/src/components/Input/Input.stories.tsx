import { Button } from '@components/Button';
import { SystemIcon } from '@components/Icon';
import { IInputProps, Input } from '@components/Input';
import { Stack } from '@components/Stack';
import type { Meta, StoryObj } from '@storybook/react';
import { vars } from '@theme/vars.css';
import React from 'react';

const meta: Meta<
  {
    leftIcon: keyof typeof SystemIcon;
  } & IInputProps
> = {
  title: 'Components/Input',
  parameters: {
    docs: {
      description: {
        component:
          'The Input component is a wrapper around the native input element that provides the ability to add additional information.',
      },
    },
  },
  argTypes: {
    disabled: {
      description: 'Disables the input and applies visual styling.',
      control: {
        type: 'boolean',
      },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    leftIcon: {
      description:
        'Icon rendered inside the input to the left of the input text.',
      options: [
        undefined,
        ...(Object.keys(SystemIcon) as (keyof typeof SystemIcon)[]),
      ],
      control: {
        type: 'select',
      },
    },
    rightIcon: {
      description:
        'Icon rendered inside the input to the right of the input text.',
      options: [
        undefined,
        ...(Object.keys(SystemIcon) as (keyof typeof SystemIcon)[]),
      ],
      control: {
        type: 'select',
      },
    },
    leadingText: {
      description: 'Leading text that is rendered to the left of the input.',
      control: {
        type: 'text',
      },
    },
    leadingTextWidth: {
      description:
        'Width of the leading text. Defaults to the size of the text itself.',
      control: {
        type: 'select',
      },
      options: [
        undefined,
        ...Object.keys(vars.sizes).map((key) => key as keyof typeof vars.sizes),
      ],
    },
    outlined: {
      description: 'Option to render the input with an outline.',
      control: {
        type: 'boolean',
      },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
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
    leadingTextWidth: undefined,
    outlined: false,
  },
  render: ({
    leftIcon,
    rightIcon,
    outlined,
    leadingText,
    leadingTextWidth,
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
      leadingTextWidth={leadingTextWidth}
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
