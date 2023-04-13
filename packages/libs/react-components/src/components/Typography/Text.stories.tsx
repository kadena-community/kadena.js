import {
  boldVariant,
  elementVariant,
  fontVariant,
  textSizeVariant,
  transformVariant,
} from './styles';
import { Text } from './Text';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

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
    size: 'lg',
    font: 'main',
    bold: 'false',
    transform: 'none',
  },
  render: ({ font, bold, size, as, variant, transform, children }) => (
    <Text
      font={font}
      bold={bold}
      size={size}
      as={as}
      variant={variant}
      transform={transform}
    >
      {children}
    </Text>
  ),
};
