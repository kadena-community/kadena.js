import { Button } from '@components/Button';
import type { IInputProps } from '@components/Form';
import { Input } from '@components/Form';
import { SystemIcon } from '@components/Icon';
import { Stack } from '@components/Layout/Stack';
import { onLayer2, withContentWidth } from '@storyDecorators';
import type { Meta, StoryObj } from '@storybook/react';
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
  title: 'Form/Input/Input',
  component: Input,
  decorators: [withContentWidth, onLayer2],
  parameters: {
    status: { type: 'inDevelopment' },
    docs: {
      description: {
        component:
          'The Input component is a wrapper around the native input element that provides the ability to add additional information. This handles any kind of children that will be rendered inside the input on the right side of it.',
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
    startIcon: {
      description:
        'Icon rendered inside the input to the left of the input text.',
      options: ['-', ...Object.keys(SystemIcon)],
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
    startIcon: React.ReactElement | '-';
    type: React.HTMLInputTypeAttribute;
  } & Omit<IInputProps, 'startIcon'>
>;

export const Dynamic: Story = {
  name: 'Input',
  args: {
    startIcon: undefined,
    type: 'text',
    leadingText: '',
    outlined: false,
  },
  render: ({ startIcon, outlined, leadingText, onChange, disabled, type }) => {
    const IconComponent =
      startIcon !== '-'
        ? SystemIcon[startIcon as unknown as keyof typeof SystemIcon]
        : undefined;
    return (
      <Input
        id="inlineInputStory"
        startIcon={IconComponent && <IconComponent />}
        onChange={onChange}
        placeholder="This is a placeholder"
        leadingText={leadingText}
        outlined={outlined}
        disabled={disabled}
        type={type}
      />
    );
  },
};

export const InlineWithButton: Story = {
  name: 'Inline with button',
  args: {
    startIcon: undefined,
    type: 'text',
  },
  render: ({ startIcon, onChange, type }) => {
    const IconComponent =
      startIcon !== '-'
        ? SystemIcon[startIcon as unknown as keyof typeof SystemIcon]
        : undefined;
    return (
      <Stack gap="xs" alignItems="stretch">
        <Input
          id="inlineInputStory"
          startIcon={IconComponent && <IconComponent />}
          onChange={onChange}
          placeholder="This is a placeholder"
          outlined
          type={type}
        />
        <Button title="Submit" onClick={() => {}}>
          Submit
        </Button>
      </Stack>
    );
  },
};
