import { GradientText } from './GradientText';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof GradientText> = {
  title: 'Typography/GradientText',
  component: GradientText,
  argTypes: {
    children: {
      control: { type: 'text' },
    },
    as: {
      control: { type: 'select' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GradientText>;

export const Primary: Story = {
  name: 'GradientText',
  args: {
    children: 'web3',
    as: 'span',
  },
  render: ({ as, children }) => <GradientText as={as}>{children}</GradientText>,
};
