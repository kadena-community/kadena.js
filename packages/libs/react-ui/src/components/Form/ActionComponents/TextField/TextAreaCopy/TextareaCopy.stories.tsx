import type { ITextareaProps } from '@components/Form';
import { Textarea } from '@components/Form';

import type { SystemIcon } from '@components/Icon';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { TextAreaCopy } from '../ActionComponents/TextField';
import { TextareaCopy } from './TextareaCopy';

const meta: Meta<ITextareaProps> = {
  title: 'Form/TextareaCopy',
  component: TextAreaCopy,
  parameters: {
    docs: {
      description: {
        component:
          'The Textarea TextAreaCopy is a composition of the native textArea element and a copy button.',
      },
    },
  },
  argTypes: {
    disabled: {
      description: 'Disables the textArea and applies visual styling.',
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
    rightIcon: keyof typeof SystemIcon;
    type: React.HTMLInputTypeAttribute;
  } & ITextareaProps
>;

export const TextareaStory: Story = {
  name: 'Textarea',
  args: {
    disabled: false,
    fontFamily: '$mono',
    outlined: false,
  },
  render: (props) => {
    return (
      <TextareaCopy
        {...props}
        id="TextareaStoryStory"
        placeholder="This is a placeholder"
      />
    );
  },
};
