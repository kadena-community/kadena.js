import type { IInputProps } from '@components/Form';
import { InputShowHide } from '@components/Form';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<IInputProps> = {
  title: 'Form/Input/InputShowHide',
  component: InputShowHide,
  parameters: {
    docs: {
      description: {
        component:
          'The InputShowHide is a composition of the native Input element and a show hide toggle button.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<IInputProps>;

export const InputShowHideStory: Story = {
  name: 'InputShowHide',
  args: {
    icon: undefined,
    type: 'text',
    leadingTextWidth: undefined,
    leadingText: '',
    outlined: false,
  },
  render: (props) => {
    return (
      <>
        <InputShowHide
          {...props}
          id="InputShowHideStory"
          placeholder="This is a placeholder"
        />
      </>
    );
  },
};
