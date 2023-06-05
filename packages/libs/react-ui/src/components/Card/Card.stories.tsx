import { Button } from '../Button/Button';

import { Card, ICardProps } from './Card';
import { fullWidthVariant, stackVariant } from './Card.css';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<ICardProps> = {
  title: 'Layout/Card',
  argTypes: {
    stack: {
      options: Object.keys(stackVariant) as (keyof typeof stackVariant)[],
      control: {
        type: 'select',
      },
    },
    fullWidth: {
      options: Object.keys(
        fullWidthVariant,
      ) as (keyof typeof fullWidthVariant)[],
      control: {
        type: 'select',
      },
    },
  },
};

export default meta;
type Story = StoryObj<ICardProps>;

export const Primary: Story = {
  name: 'Card',
  args: {
    stack: 'false',
    fullWidth: 'false',
  },
  render: ({ stack, fullWidth }) => {
    return (
      <>
        <Card stack={stack} fullWidth={fullWidth}>
          <h4>Getting Started is Simple</h4>
          <div>
            Learn Kadena&apos;s core concepts & tools for development in 15
            minutes
          </div>

          <Button title={'Button'}>Hello World Tutorial</Button>
        </Card>
        <Card stack={stack} fullWidth={fullWidth}>
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
