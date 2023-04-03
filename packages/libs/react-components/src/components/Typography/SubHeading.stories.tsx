import { SubHeading } from './SubHeading';
import * as variants from './variants';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof SubHeading> = {
  title: 'SubHeading',
  component: SubHeading,
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
type Story = StoryObj<typeof SubHeading>;

export const Horizontal: Story = {
  name: 'SubHeading',
  args: {
    font: 'main',
    bold: 'false',
    as: 'h3',
  },
  render: ({ font, bold, as }) => (
    <SubHeading font={font} bold={bold} as={as}>
      SubHeading
    </SubHeading>
  ),
};
