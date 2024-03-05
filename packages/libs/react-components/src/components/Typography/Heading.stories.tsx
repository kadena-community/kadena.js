import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Heading } from './Heading';
import {
  boldVariant,
  colorVariant,
  elementVariant,
  fontVariant,
  transformVariant,
} from './styles';

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
      options: Object.keys(elementVariant) as (keyof typeof elementVariant)[],
      control: { type: 'select' },
    },
    font: {
      options: Object.keys(fontVariant) as (keyof typeof fontVariant)[],
      control: { type: 'radio' },
    },
    bold: {
      options: Object.keys(boldVariant) as (keyof typeof boldVariant)[],
      control: { type: 'boolean' },
    },
    color: {
      options: Object.keys(colorVariant) as (keyof typeof colorVariant)[],
      control: { type: 'select' },
    },
    transform: {
      options: Object.keys(
        transformVariant,
      ) as (keyof typeof transformVariant)[],
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
      font={font}
      bold={bold}
      as={as}
      variant={variant}
      color={color}
      transform={transform}
    >
      {children}
    </Heading>
  ),
};
