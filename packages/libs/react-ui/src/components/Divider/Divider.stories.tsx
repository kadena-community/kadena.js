import { Divider } from './Divider';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta = {
  title: 'Layout/Divider',
  component: Divider,
};

type Story = StoryObj;

export const Static: Story = {
  name: 'Divider',

  render: () => {
    return <Divider />;
  },
};

export default meta;
