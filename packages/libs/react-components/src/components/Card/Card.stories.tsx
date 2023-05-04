import { Button, SystemIcons } from './../../';
import { Card, ICardProps } from '.';
import { CardBody, CardColors, CardFooter, CardHeading } from './';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

type ColorType = 'default' | 'accent';
const meta: Meta<
  {
    color: ColorType;
    expand: boolean;
  } & ICardProps
> = {
  title: 'Layout/Card',
  argTypes: {
    color: {
      options: Object.values(CardColors),
      control: {
        type: 'select',
      },
    },
    expand: {
      control: {
        type: 'boolean',
      },
    },
  },
};

export default meta;
type Story = StoryObj<
  {
    color: CardColors;
    expand: boolean;
  } & ICardProps
>;

export const Primary: Story = {
  name: 'Card',
  args: {
    color: 'default' as CardColors,
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
