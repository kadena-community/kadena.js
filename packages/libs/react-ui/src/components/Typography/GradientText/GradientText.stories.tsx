import { GradientText } from '@components/Typography/GradientText/GradientText';
import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof GradientText> = {
  title: 'Typography/GradientText',
  component: GradientText,
  argTypes: {
    children: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GradientText>;

export const Primary: Story = {
  name: 'GradientText',
  args: {
    children: 'web3',
  },
  render: ({ children }) => <GradientText>{children}</GradientText>,
};
