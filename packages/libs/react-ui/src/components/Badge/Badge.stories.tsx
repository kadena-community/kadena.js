import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { withCenteredStory, withContentWidth } from '../../storyDecorators';
import type { IBadgeProps } from './Badge';
import { Badge } from './Badge';

const meta: Meta<IBadgeProps> = {
  title: 'Components/Badge',
  decorators: [withContentWidth, withCenteredStory],
  parameters: {
    status: {
      type: ['releaseCandidate'],
    },
    docs: {
      description: {
        component: 'A component to render text in a badge',
      },
    },
  },
  component: Badge,
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['lg', 'sm'],
    },
    style: {
      control: { type: 'radio' },
      options: [
        'default',
        'inverse',
        'info',
        'warning',
        'positive',
        'negative',
      ],
    },
  },
};

export default meta;
type Story = StoryObj<IBadgeProps>;

export const _Badge: Story = {
  args: {
    children: '6',
    size: 'sm',
    style: 'default',
  },
  render: (props) => {
    return <Badge {...props}></Badge>;
  },
};
