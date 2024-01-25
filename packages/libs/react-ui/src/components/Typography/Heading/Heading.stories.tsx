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
    bold: {
      options: HEADING_ELEMENTS,
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
type Story = StoryObj<typeof Heading>;

export const Primary: Story = {
  name: 'Heading',
  args: {
    as: 'h1',
    children: 'heading',
    variant: undefined,
    bold: undefined,
    color: undefined,
    transform: undefined,
  },
  render: ({ as, bold, variant, transform, children, color }) => (
    <Heading
      as={as}
      variant={variant}
      bold={bold}
      color={color}
      transform={transform}
    >
      {children}
    </Heading>
  ),
};
