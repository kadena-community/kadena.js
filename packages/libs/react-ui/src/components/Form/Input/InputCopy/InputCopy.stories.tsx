import type { IInputProps } from '@components/Form';
import { InputCopy } from '@components/Form';

import type { Meta, StoryObj } from '@storybook/react';
import { onLayer2, withContentWidth } from '@storyDecorators';
import React from 'react';

const meta: Meta<IInputProps> = {
  title: 'Form/Input/InputCopy',
  component: InputCopy,
  decorators: [withContentWidth, onLayer2],
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

type Story = StoryObj<IInputProps>;

export const InputCopyStory: Story = {
  name: 'InputCopy',
  args: {
    type: 'text',
    leadingText: '',
    outlined: false,
  },
  render: (props) => {
    return (
      <>
        <InputCopy
          {...props}
          id="InputCopyStory"
          placeholder="This is a placeholder"
        />
      </>
    );
  },
};
