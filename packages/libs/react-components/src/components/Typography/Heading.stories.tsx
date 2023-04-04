import { Heading } from './Heading';
import { boldVariant, fontVariant } from './styles';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof Heading> = {
  title: 'Typography/Heading',
  component: Heading,
  argTypes: {
    font: {
      options: Object.keys(fontVariant) as (keyof typeof fontVariant)[],
      control: { type: 'radio' },
    },
    bold: {
      options: Object.keys(boldVariant) as (keyof typeof boldVariant)[],
      control: { type: 'boolean' },
    },
    as: {
      control: { type: 'select' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const Horizontal: Story = {
  name: 'Heading',
  args: {
    font: 'main',
    bold: 'true',
    as: 'h1',
  },
  render: ({ font, bold, as }) => (
    <Heading font={font} bold={bold} as={as}>
      Heading
    </Heading>
  ),
};
