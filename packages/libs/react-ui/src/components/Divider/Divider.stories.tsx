import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { withContentWidth } from '../../storyDecorators';
import { getVariants } from '../../storyDecorators/getVariants';
import { Card } from '../Card';
import { Divider } from './Divider';
import { dividerClass } from './Divider.css';

const variants = getVariants(dividerClass);

const meta: Meta = {
  title: 'Layout/Divider',
  decorators: [withContentWidth],
  argTypes: {
    variant: {
      control: {
        type: 'select',
      },
      options: variants.variant,
    },
  },
  parameters: {
    status: { type: 'stable' },
    docs: {
      description: {
        component:
          'Component which helps to separate one logical group of element from others.',
      },
    },
  },
  component: Divider,
};

type Story = StoryObj;

export const Static: Story = {
  name: 'Divider',

  render: (args) => {
    return (
      <>
        <Card>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
          <Divider {...args} />
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Card>
      </>
    );
  },
};

export default meta;
