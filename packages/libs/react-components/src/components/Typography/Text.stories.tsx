import { boldVariant, fontVariant, textSizeVariant } from './styles';
import { Text } from './Text';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof Text> = {
  title: 'Typography/Text',
  component: Text,
  argTypes: {
    font: {
      options: Object.keys(fontVariant) as (keyof typeof fontVariant)[],
      control: { type: 'radio' },
    },
    bold: {
      options: Object.keys(boldVariant) as (keyof typeof boldVariant)[],
      control: { type: 'boolean' },
    },
    size: {
      options: Object.keys(textSizeVariant) as (keyof typeof textSizeVariant)[],
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
