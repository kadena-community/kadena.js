import { Button, SystemIcons } from './../../';
import type { ICardProps } from '.';
import { fullWidthVariant, stackVariant } from './styles';
import { Card } from '.';

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
    stack: false,
    fullWidth: false,
  },
  render: ({ stack, fullWidth }) => {
    return (
      <>
        <Card.Container stack={stack} fullWidth={fullWidth}>
          <Card.Heading>Getting Started is Simple</Card.Heading>
          <Card.Body>
            Learn Kadena&apos;s core concepts & tools for development in 15
            minutes
          </Card.Body>
          <Card.Footer>
            <Button title={'Button'} icon={SystemIcons.Information}>
              Get Started
            </Button>
            <Button title={'Button'}>Hello World Tutorial</Button>
          </Card.Footer>
        </Card.Container>

        <Card.Container stack={stack} fullWidth={fullWidth}>
          <Card.Heading>Getting Started is Simple</Card.Heading>
          <Card.Body>
            Learn Kadena&apos;s core concepts & tools for development in 15
            minutes
          </Card.Body>
          <Card.Footer>
            <Button title={'Button'} icon={SystemIcons.Information}>
              Get Started
            </Button>
            <Button title={'Button'}>Hello World Tutorial</Button>
          </Card.Footer>
        </Card.Container>
      </>
    );
  },
};
