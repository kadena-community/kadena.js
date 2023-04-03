import { Text } from './Text';
import * as variants from './variants';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof Text> = {
  title: 'Text',
  component: Text,
  argTypes: {
    font: {
      options: Object.keys(variants.font) as (keyof typeof variants.font)[],
      control: { type: 'radio' },
    },
    bold: {
      options: Object.keys(variants.bold) as (keyof typeof variants.bold)[],
      control: { type: 'boolean' },
    },
    size: {
      options: Object.keys(
        variants.textSize,
      ) as (keyof typeof variants.textSize)[],
      control: { type: 'radio' },
    },
    as: {
      control: { type: 'select' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Horizontal: Story = {
  name: 'Text',
  args: {
    font: 'main',
    bold: 'false',
    size: 'lg',
    as: 'span',
  },
  render: ({ font, bold, size, as }) => (
    <Text font={font} bold={bold} size={size} as={as}>
      Text
    </Text>
  ),
};
