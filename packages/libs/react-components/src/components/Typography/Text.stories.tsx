import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Text } from './Text';
import {
  boldVariant,
  colorVariant,
  elementVariant,
  fontVariant,
  textSizeVariant,
  transformVariant,
} from './styles';

const meta: Meta<typeof Text> = {
  title: 'Typography/Text',
  component: Text,
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
    size: {
      options: Object.keys(textSizeVariant) as (keyof typeof textSizeVariant)[],
      control: { type: 'radio' },
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
type Story = StoryObj<typeof Text>;

export const Primary: Story = {
  name: 'Text',
  args: {
    children: 'text',
    as: 'span',
    variant: undefined,
    size: undefined,
    font: undefined,
    bold: undefined,
    color: undefined,
    transform: undefined,
  },
  render: ({ font, bold, size, as, variant, transform, children, color }) => (
    <Text
      font={font}
      bold={bold}
      size={size}
      as={as}
      variant={variant}
      transform={transform}
      color={color}
    >
      {children}
    </Text>
  ),
};
