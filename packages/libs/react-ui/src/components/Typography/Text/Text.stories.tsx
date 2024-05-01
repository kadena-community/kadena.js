import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Text } from './Text';

const meta: Meta<typeof Text> = {
  title: 'Typography/Text',
  component: Text,
  parameters: {
    status: {
      type: ['Done'],
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
