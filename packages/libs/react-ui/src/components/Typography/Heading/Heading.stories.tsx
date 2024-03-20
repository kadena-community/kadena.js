import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { colorVariants, transformVariants } from '../typography.css';
import { HEADING_ELEMENTS, Heading } from './Heading';

const meta: Meta<typeof Heading> = {
  title: 'Typography/Heading',
  component: Heading,
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
      options: HEADING_ELEMENTS,
      control: { type: 'select' },
    },
    variant: {
      options: HEADING_ELEMENTS,
      control: { type: 'select' },
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
type Story = StoryObj<typeof Heading>;

export const Primary: Story = {
  name: 'Heading',
  args: {
    as: 'h1',
    children: 'heading',
    variant: undefined,
    color: undefined,
    transform: undefined,
  },
  render: ({ as, variant, transform, children, color }) => (
    <Heading as={as} variant={variant} color={color} transform={transform}>
      {children}
    </Heading>
  ),
};
