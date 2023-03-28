import { Stack } from './Stack';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// TODO: Story isn't updating
const meta: Meta<typeof Stack> = {
  title: 'Stack',
  component: Stack,
};

export default meta;
type Story = StoryObj<typeof Stack>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/react/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  name: 'Default Stack',
  args: {
    spacing: 'md',
    direction: 'horizontal',
  },
  render: ({ spacing, direction }) => (
    <>
      <Stack spacing={spacing} direction={direction}>
        <div>testing</div>
        <div>testing</div>
        <div>testing</div>
      </Stack>
    </>
  ),
};
