import type { ITextAreaFieldProps } from './TextAreaField';
import { TextAreaField } from './TextAreaField';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<ITextAreaFieldProps> = {
  title: 'Form/TextAreaField',
  component: TextAreaField,
  parameters: {
    docs: {
      description: {
        component:
          'The TextAreaField component is a wrapper around the native textarea element that provides the ability to add additional information.',
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

    textAreaProps: {
      description: 'Props for the textarea element.',
      control: {
        type: 'object',
      },
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<ITextAreaFieldProps>;

export const TextFieldStory: Story = {
  name: 'TextField config',
  args: {
    disabled: false,
    tag: 'tag',
    helperText: 'This is helper text',
    info: '(optional)',
    label: 'Label',
    textAreaProps: {
      hasCopyButton: true,
      id: 'TextFieldStory',
      fontFamily: '$mono',
      placeholder: 'This is a placeholder',
    },
  },
  render: ({ disabled, textAreaProps, ...rest }) => (
    <TextAreaField
      disabled={disabled}
      textAreaProps={textAreaProps}
      {...rest}
    />
  ),
};
