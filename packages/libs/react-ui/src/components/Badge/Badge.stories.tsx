import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { withCenteredStory, withContentWidth } from '../../storyDecorators';
import { getVariants } from '../../storyDecorators/getVariants';
import type { IBadgeProps } from './Badge';
import { Badge } from './Badge';
import { badge } from './Badge.css';

const { style, size } = getVariants(badge);

const meta: Meta<IBadgeProps> = {
  title: 'Components/Badge',
  decorators: [withContentWidth, withCenteredStory],
  parameters: {
    status: {
      type: ['stable'],
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
      options: size,
    },
    style: {
      control: { type: 'radio' },
      options: style,
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
