import {
  colorVariants,
  fontVariants,
  transformVariants,
} from '../typography.css';

import { boldVariants, elementVariants } from './Heading.css';

import { Heading } from '@components/Typography/Heading/Heading';
import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof Heading> = {
  title: 'Typography/Heading',
  component: Heading,
  argTypes: {
    children: {
      control: { type: 'text' },
    },
    as: {
      control: { type: 'select' },
    },
    variant: {
      options: Object.keys(elementVariants) as (keyof typeof elementVariants)[],
      control: { type: 'select' },
    },
    font: {
      options: Object.keys(fontVariants) as (keyof typeof fontVariants)[],
      control: { type: 'radio' },
    },
    bold: {
      options: Object.keys(boldVariants) as (keyof typeof boldVariants)[],
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
    children: 'heading',
    as: 'h1',
    variant: undefined,
    font: undefined,
    bold: undefined,
    color: undefined,
    transform: undefined,
  },
  render: ({ font, bold, as, variant, transform, children, color }) => (
    <Heading
      as={as}
      variant={variant}
      font={font}
      bold={bold}
      color={color}
      transform={transform}
    >
      {children}
    </Heading>
  ),
};
