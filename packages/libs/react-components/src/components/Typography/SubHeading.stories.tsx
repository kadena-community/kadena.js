import { boldVariant, fontVariant } from './styles';
import { SubHeading } from './SubHeading';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof SubHeading> = {
  title: 'Typography/SubHeading',
  component: SubHeading,
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
type Story = StoryObj<typeof SubHeading>;

export const Horizontal: Story = {
  name: 'SubHeading',
  args: {
    font: 'main',
    bold: 'true',
    as: 'h3',
  },
  render: ({ font, bold, as }) => (
    <SubHeading font={font} bold={bold} as={as}>
      SubHeading
    </SubHeading>
  ),
};
