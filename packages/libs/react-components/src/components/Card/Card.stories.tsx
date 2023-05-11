import { Button, SystemIcons } from './../../';
import { colorVariant, expandVariant } from './styles';
import { Card, ICardProps } from '.';
import { CardBody, CardFooter, CardHeading } from './';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<ICardProps> = {
  title: 'Layout/Card',
  argTypes: {
    color: {
      options: Object.keys(colorVariant) as (keyof typeof colorVariant)[],
      control: {
        type: 'select',
      },
    },
    expand: {
      options: Object.keys(expandVariant) as (keyof typeof expandVariant)[],
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
    color: 'default',
    expand: false,
  },
  render: ({ color, expand }) => {
    return (
      <Card color={color} expand={expand}>
        <CardHeading>Getting Started is Simple</CardHeading>
        <CardBody>
          Learn Kadena&apos;s core concepts & tools for development in 15
          minutes
        </CardBody>
        <CardFooter>
          <Button title={'Button'} icon={SystemIcons.Information}>
            Get Started
          </Button>
          <Button title={'Button'}>Hello World Tutorial</Button>
        </CardFooter>
      </Card>
    );
  },
};
