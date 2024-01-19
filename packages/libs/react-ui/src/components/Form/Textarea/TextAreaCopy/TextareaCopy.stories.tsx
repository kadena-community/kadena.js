import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import type { ITextareaProps } from '../Textarea';

import { onLayer2, withContentWidth } from '../../../../storyDecorators';
import { TextareaCopy } from './TextareaCopy';

const meta: Meta<ITextareaProps> = {
  title: 'Form/Textarea/TextareaCopy',
  component: TextareaCopy,
  decorators: [withContentWidth, onLayer2],
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

type Story = StoryObj<ITextareaProps>;

export const TextareaCopyStory: Story = {
  name: 'TextareaCopy',
  args: {
    disabled: false,
    fontFamily: 'codeFont',
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
