import type { ITextareaProps } from '@components/Form';
import { Textarea } from '@components/Form';
import type { Meta, StoryObj } from '@storybook/react';
import { onLayer2, withContentWidth } from '@storyDecorators';
import React, { useState } from 'react';

const meta: Meta<ITextareaProps> = {
  title: 'Form/Textarea/Textarea',
  component: Textarea,
  decorators: [withContentWidth, onLayer2],
  parameters: {
    status: { type: 'inDevelopment' },
    docs: {
      description: {
        component:
          'The Textarea component is a wrapper around the native textArea element that provides the ability to add additional information.',
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

export const TextareaStory: Story = {
  name: 'Textarea',
  args: {
    disabled: false,
    fontFamily: 'codeFont',
    outlined: false,
  },
  render: (props) => {
    const [value, setValue] = useState<string>('');

    return (
      <Textarea
        {...props}
        value={value}
        onChange={({ target }) => setValue(target.value)}
        id="TextareaStory"
        placeholder="This is a placeholder"
      />
    );
  },
};
