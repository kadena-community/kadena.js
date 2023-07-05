import { IMaskedValueProps, MaskedValue } from './MaskedValue';

import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<IMaskedValueProps> = {
  title: 'Components/MaskedValue',
  argTypes: {
    title: {
      control: {
        type: 'text',
      },
    },
    value: {
      control: {
        type: 'text',
      },
    },
    defaultVisibility: {
      control: {
        type: 'boolean',
      },
    },
  },
};

export default meta;

type Story = StoryObj<IMaskedValueProps>;

export const Primary: Story = {
  name: 'MaskedValue',
  args: {
    title: 'Account',
    value: 'k:1234567890abcdef',
    defaultVisibility: false,
  },
  render: ({ title, value, defaultVisibility }) => {
    return (
      <>
        <MaskedValue
          title={title}
          value={value}
          defaultVisibility={defaultVisibility}
        />
      </>
    );
  },
};
