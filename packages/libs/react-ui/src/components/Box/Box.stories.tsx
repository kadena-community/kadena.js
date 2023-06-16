import { Box, IBoxProps } from './Box';
import { marginVariants } from './Box.css';
import { containerClass, contentClass } from './stories.css';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<IBoxProps> = {
  title: 'Layout/Box',
  argTypes: {
    margin: {
      options: Object.keys(marginVariants) as (keyof typeof marginVariants)[],
      control: {
        type: 'select',
      },
    },
  },
};

export default meta;
type Story = StoryObj<IBoxProps>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/react/api/csf
 * to learn how to use render functions.
 */

export const Primary: Story = {
  name: 'Box',
  args: {
    margin: '$0',
  },
  render: ({ margin }) => (
    <div className={containerClass}>
      <Box margin={margin}>
        <div className={contentClass}>Box</div>
      </Box>
    </div>
  ),
};
