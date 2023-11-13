import { CopyButton } from '@components/ActionButtons/CoppyButton';
import type { ITextareaProps } from '@components/Form';
import { Textarea } from '@components/Form';
import type { SystemIcon } from '@components/Icon';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

const meta: Meta<ITextareaProps> = {
  title: 'Form/Textarea',
  component: Textarea,
  parameters: {
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
    const [value, setValue] = useState<string>('');

    return (
      <Textarea
        {...props}
        value={value}
        onChange={({ target }) => setValue(target.value)}
        id="inlineInputStory"
        placeholder="This is a placeholder"
      >
        <CopyButton value={value} />
      </Textarea>
    );
  },
};
