import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { colorVariants, transformVariants } from '../typography.css';
import { Text } from './Text';

const meta: Meta<typeof Text> = {
  title: 'Typography/Text',
  component: Text,
  parameters: {
    status: {
      type: ['releaseCandidate'],
    },
  },
  argTypes: {
    children: {
      control: { type: 'text' },
    },
    as: {
      control: { type: 'select' },
    },
    variant: {
      options: ['small', 'smallest', 'base'],
      control: { type: 'select' },
    },
    bold: {
      control: { type: 'boolean' },
    },
    color: {
      options: Object.keys(colorVariants) as (keyof typeof colorVariants)[],
      control: { type: 'select' },
    },
    transform: {
      options: Object.keys(
        transformVariants,
      ) as (keyof typeof transformVariants)[],
      control: { type: 'radio' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Primary: Story = {
  name: 'Text',
  args: {
    children: 'text',
    as: 'span',
    variant: undefined,
    bold: undefined,
    color: undefined,
    transform: undefined,
  },
  render: ({ bold, as, variant, transform, children, color }) => (
    <Text
      bold={bold}
      as={as}
      variant={variant}
      transform={transform}
      color={color}
    >
      {children}
    </Text>
  ),
};
