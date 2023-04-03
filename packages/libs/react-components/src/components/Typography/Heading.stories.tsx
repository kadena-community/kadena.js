import { Heading } from './Heading';
import * as variants from './variants';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof Heading> = {
  title: 'Heading',
  component: Heading,
  argTypes: {
    font: {
      options: Object.keys(variants.font) as (keyof typeof variants.font)[],
      control: { type: 'radio' },
    },
    bold: {
      options: Object.keys(variants.bold) as (keyof typeof variants.bold)[],
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
    bold: 'false',
    as: 'h1',
  },
  render: ({ font, bold, as }) => (
    <Heading font={font} bold={bold} as={as}>
      Heading
    </Heading>
  ),
};
