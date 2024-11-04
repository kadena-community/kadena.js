import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Heading } from '../Heading/Heading';
import { Text } from './Text';

const meta: Meta<typeof Text> = {
  title: 'Typography/Text',
  component: Text,
  parameters: {
    status: {
      type: ['stable'],
    },
  },
  argTypes: {
    children: {
      control: { type: 'text' },
    },
    as: {
      control: { type: 'radio' },
    },
    variant: {
      control: { type: 'radio' },
    },
    size: {
      control: { type: 'radio' },
    },
    color: {
      control: { type: 'radio' },
    },
    transform: {
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
  },
  render: (props) => <Text {...props}>{props.children}</Text>,
};

export const InheritText: Story = {
  name: 'Text w/ inherited size',
  args: {
    children: 'text inheriting',
    size: 'inherit',
    color: 'emphasize',
  },
  render: (props) => (
    <Heading as="h1">
      Header with <Text {...props}>{props.children}</Text> parent size
    </Heading>
  ),
};
