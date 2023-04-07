import {
  boldVariant,
  elementVariant,
  fontVariant,
  textSizeVariant,
} from './styles';
import { Text } from './Text';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof Text> = {
  title: 'Typography/Text',
  component: Text,
  argTypes: {
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
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Primary: Story = {
  name: 'Text',
  args: {
    as: 'span',
    variant: undefined,
    size: 'lg',
    font: 'main',
    bold: 'false',
  },
  render: ({ font, bold, size, as, variant }) => (
    <Text font={font} bold={bold} size={size} as={as} variant={variant}>
      Text
    </Text>
  ),
};
