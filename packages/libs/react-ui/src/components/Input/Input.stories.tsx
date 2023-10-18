import { Button } from '@components/Button';
import { SystemIcon } from '@components/Icon';
import type { IInputProps } from '@components/Input';
import { Input } from '@components/Input';
import { Stack } from '@components/Stack';
import type { Meta, StoryObj } from '@storybook/react';
import { vars } from '@theme/vars.css';
import type { HTMLInputTypeAttribute } from 'react';
import React from 'react';

const HTMLInputTypes: HTMLInputTypeAttribute[] = [
  'button',
  'checkbox',
  'color',
  'date',
  'datetime-local',
  'email',
  'file',
  'hidden',
  'image',
  'month',
  'number',
  'password',
  'radio',
  'range',
  'reset',
  'search',
  'submit',
  'tel',
  'text',
  'time',
  'url',
  'week',
];

const meta: Meta<IInputProps> = {
  title: 'Form/Input',
  component: Input,
  parameters: {
    docs: {
      description: {
        component:
          'The Input component is a wrapper around the native input element that provides the ability to add additional information.',
      },
    },
  },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: HTMLInputTypes,
    },
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
    icon: {
      description:
        'Icon rendered inside the input to the left of the input text.',
      options: [
        '-',
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
        '- Omit this property to auto-size the leading text',
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

    type: React.HTMLInputTypeAttribute;
  } & Omit<IInputProps, 'icon'>
>;

export const Dynamic: Story = {
  name: 'Input',
  args: {
    icon: undefined,
    type: 'text',
    leadingText: '',
    leadingTextWidth: undefined,
    outlined: false,
  },
  render: ({
    icon,
    outlined,
    leadingText,
    leadingTextWidth,
    onChange,
    disabled,
    type,
  }) => (
    <Input
      id="inlineInputStory"
      icon={icon}
      onChange={onChange}
      placeholder="This is a placeholder"
      leadingText={leadingText}
      leadingTextWidth={leadingTextWidth}
      outlined={outlined}
      disabled={disabled}
      type={type}
    />
  ),
};

export const InlineWithButton: Story = {
  name: 'Inline with button',
  args: {
    icon: undefined,
    type: 'text',
  },
  render: ({ icon, onChange, type }) => (
    <Stack gap="$xs" alignItems="stretch">
      <Input
        id="inlineInputStory"
        icon={icon}
        onChange={onChange}
        placeholder="This is a placeholder"
        outlined
        type={type}
      />
      <Button title="Submit" onClick={() => {}}>
        Submit
      </Button>
    </Stack>
  ),
};
