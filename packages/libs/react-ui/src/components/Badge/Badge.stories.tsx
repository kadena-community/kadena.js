import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { withCenteredStory, withContentWidth } from '../../storyDecorators';
import type { IBadgeProps } from './Badge';
import { Badge } from './Badge';

const meta: Meta<IBadgeProps> = {
  title: 'Components/Badge',
  decorators: [withContentWidth, withCenteredStory],
  component: Badge,
  parameters: {
    status: {
      type: [''],
    },
    docs: {
      description: {
        component: 'A component used for displaying user icon.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<IBadgeProps>;

export const Primary: Story = {
  name: 'Badge',
  args: {
    name: 'Mafi Rulis',
  },
  render: ({ name }) => {
    return <Badge name={name} />;
  },
};
