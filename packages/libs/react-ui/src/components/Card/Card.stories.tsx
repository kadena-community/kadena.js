import { Button } from '@components/Button';
import { Card, ICardProps } from '@components/Card';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<ICardProps> = {
  title: 'Layout/Card',
  parameters: {
    docs: {
      description: {
        component:
          'A component used for grouping se of items in a card.\n' +
          '\nThis component allows for passing the <i>stack</i>, <i>fullWidth</i>,  and <i>disabled</i> properties.',
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
        'If true, the component stacks the child elements vertically.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    fullWidth: {
      control: {
        type: 'boolean',
      },
      description: 'If true, the component has the full width of its parent.',
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
