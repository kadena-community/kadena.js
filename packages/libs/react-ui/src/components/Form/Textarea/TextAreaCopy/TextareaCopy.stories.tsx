import type { ITextareaProps } from '@components/Form';

import type { SystemIcon } from '@components/Icon';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { TextareaCopy } from './TextareaCopy';

const meta: Meta<ITextareaProps> = {
  title: 'Form/TextareaCopy',
  component: TextareaCopy,
  parameters: {
    docs: {
      description: {
        component:
          'The TextAreaCopy is a composition of the native textArea element and a copy button.',
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

export const TextareaCopyStory: Story = {
  name: 'TextareaCopy',
  args: {
    disabled: false,
    fontFamily: '$mono',
    outlined: false,
  },
  render: (props) => {
    return (
      <TextareaCopy
        {...props}
        id="TextareaCopyStory"
        placeholder="This is a placeholder"
      />
    );
  },
};
