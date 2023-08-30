import { Divider } from './Divider';
import { ContentClass } from './stories.css';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta = {
  title: 'Layout/Divider',
  parameters: {
    docs: {
      description: {
        component:
          'Component which helps to separate one logical group or element from others.',
      },
    },
  },
  component: Divider,
};

type Story = StoryObj;

export const Static: Story = {
  name: 'Divider',

  render: () => {
    return (
      <>
        <div className={ContentClass}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </div>

        <Divider />
        <div className={ContentClass}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </div>
      </>
    );
  },
};

export default meta;
