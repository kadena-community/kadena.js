import { Button } from '@components/Button';
import type { ICardProps } from '@components/Card';
import { Card } from '@components/Card';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<ICardProps> = {
  title: 'Layout/Card',
  component: Card,
  argTypes: {
    stack: {
      control: {
        type: 'boolean',
      },
    },
    fullWidth: {
      control: {
        type: 'boolean',
      },
    },
    disabled: {
      control: {
        type: 'boolean',
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
