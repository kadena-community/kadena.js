import type { IInputProps, ITextareaProps } from '@components/Form';
import { InputCopy } from '@components/Form';

import type { SystemIcon } from '@components/Icon';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<ITextareaProps> = {
  title: 'Form/InputCopy',
  component: InputCopy,
  parameters: {
    docs: {
      description: {
        component:
          'The InputCopy is a composition of the native Input element and a copy button.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<
  {
    leadingText: string;
    icon: keyof typeof SystemIcon;
    rightIcon: keyof typeof SystemIcon;
    type: React.HTMLInputTypeAttribute;
  } & Omit<IInputProps, 'icon' | 'rightIcon'>
>;

export const InputCopyStory: Story = {
  name: 'InputCopy',
  args: {
    icon: undefined,
    type: 'text',
    rightIcon: undefined,
    leadingTextWidth: undefined,
    leadingText: '',
    outlined: false,
  },
  render: (props) => {
    return (
      <InputCopy
        {...props}
        id="InputCopyStory"
        placeholder="This is a placeholder"
      />
    );
  },
};
