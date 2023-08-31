import { Button } from '@components/Button';
import { Card, ICardProps } from '@components/Card';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<ICardProps> = {
  title: 'Layout/Card',
  parameters: {
    docs: {
      description: {
        component: 'A component used for grouping items in a card.',
      },
    },
  },
  component: Card,
  argTypes: {
    stack: {
      control: {
        type: 'boolean',
      },
      description:
        'If true, the component vertically stacks multiple card together and applies styles that combine them into a single card with separators.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    fullWidth: {
      control: {
        type: 'boolean',
      },
      description:
        'An option to make the card span the full width of its container.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
      description: 'Disables the input and applies visual styling.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<ICardProps>;

export const Primary: Story = {
  name: 'Card',
  args: {
    stack: false,
    fullWidth: false,
    disabled: false,
  },
  render: ({ stack, fullWidth, disabled }) => {
    return (
      <>
        <Card stack={stack} fullWidth={fullWidth} disabled={disabled}>
          <h4>Getting Started is Simple</h4>
          <div>
            Learn Kadena&apos;s core concepts & tools for development in 15
            minutes
          </div>

          <Button title={'Button'}>Hello World Tutorial</Button>
        </Card>
        <Card stack={stack} fullWidth={fullWidth} disabled={disabled}>
          <h4>Getting Started is Simple</h4>
          <div>
            Learn Kadena&apos;s core concepts & tools for development in 15
            minutes
          </div>

          <Button title={'Button'}>Hello World Tutorial</Button>
        </Card>
      </>
    );
  },
};
