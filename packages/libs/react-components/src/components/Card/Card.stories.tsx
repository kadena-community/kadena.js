import { colors } from '../../styles/colors';

import { Button, SystemIcons } from './../../';
import { CardColors } from './styles';
import { Card, ICardProps } from '.';
import { CardBody, CardFooter, CardHeading } from './';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
type ColorKeys = keyof typeof colors;

const meta: Meta<
  {
    color: ColorKeys;
    expand: boolean;
  } & ICardProps
> = {
  title: 'Layout/Card',
  argTypes: {
    color: {
      options: CardColors,
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
    color: ColorKeys;
    expand: boolean;
  } & ICardProps
>;

export const Primary: Story = {
  name: 'Card',
  args: {
    color: 'default' as ColorKeys,
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
