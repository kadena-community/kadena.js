import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { onLayer2 } from '../../../storyDecorators';
import { componentClass, containerClass, itemClass } from '../stories.css';
import {
  Legend,
  defaultBoxArgs,
  sharedStoryArgTypes,
} from '../storyComponents';
import { Box } from './Box';

const meta: Meta<typeof Box> = {
  title: 'Layout/Box',
  component: Box,
  decorators: [onLayer2],
  parameters: {
    status: {
      type: 'stable',
    },
    docs: {
      description: {
        component:
          'Box is the most basic building block of application layout.\n' +
          '\nThis component accepts an `as` prop which allows the user to pass what html element the `Box` will render as well as many style attributes that are mapped to css utility classes.',
      },
    },
  },
  argTypes: sharedStoryArgTypes,
};

export default meta;
type Story = StoryObj<typeof Box>;

export const Primary: Story = {
  name: 'Box - Margin',
  args: defaultBoxArgs,
  render: (props) => (
    <>
      <Box className={containerClass}>
        <Box {...props} className={componentClass}>
          <div className={itemClass}>Box Content</div>
        </Box>
      </Box>
      <Legend
        items={[
          { label: 'Margin', color: 'warning' },
          { label: 'Padding', color: 'positive' },
          { label: 'Content', color: 'info' },
        ]}
      />
    </>
  ),
};
