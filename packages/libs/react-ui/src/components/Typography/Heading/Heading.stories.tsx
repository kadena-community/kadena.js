import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Heading } from './Heading';

const meta: Meta<typeof Heading> = {
  title: 'Typography/Heading',
  component: Heading,
  parameters: {
    status: {
      type: ['releaseCandidate'],
    },
  },
  argTypes: {
    children: {
      control: { type: 'text' },
    },
    as: {
      control: { type: 'select' },
    },
    variant: {
      control: { type: 'select' },
    },
    transform: {
      control: { type: 'radio' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const Primary: Story = {
  name: 'Heading',
  args: {
    as: 'h1',
    children: 'heading',
  },
  render: (props) => <Heading {...props}>{props.children}</Heading>,
};
