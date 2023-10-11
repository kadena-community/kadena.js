import type { SystemIcon } from '@components/Icon';
import type { ITextareaProps } from '@components/TextArea';
import { Textarea } from '@components/TextArea';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<ITextareaProps> = {
  title: 'Form/TextArea',
  component: Textarea,
  parameters: {
    docs: {
      description: {
        component:
          'The TextArea component is a wrapper around the native textArea element that provides the ability to add additional information.',
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

export const TextAreaStory: Story = {
  name: 'TextArea config',
  args: {
    disabled: false,
    fontFamily: '$mono',
  },
  render: (props) => (
    <Textarea
      {...props}
      id="inlineInputStory"
      placeholder="This is a placeholder"
    />
  ),
};
