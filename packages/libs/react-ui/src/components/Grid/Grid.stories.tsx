import { gapVariants } from './Grid.css';
import { ContentClass } from './stories.css';
import { Grid } from '.';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof Grid.Root> = {
  title: 'Layout/Grid',
  component: Grid.Root,
  argTypes: {
    spacing: {
      options: Object.keys(gapVariants) as (keyof typeof gapVariants)[],
      control: { type: 'select' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Grid.Root>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/react/api/csf
 * to learn how to use render functions.
 */

export const Primary: Story = {
  name: 'Grid',
  args: {
    spacing: 'xl',
    columns: 12,
  },
  render: ({ spacing, columns }) => (
    <>
      <Grid.Root spacing={spacing} columns={columns}>
        {Array.from(new Array(12)).map((empty, i) => (
          <Grid.Item key={i}>
            <div className={ContentClass}>{i}</div>
          </Grid.Item>
        ))}

        <Grid.Item columnSpan={6}>
          <div className={ContentClass}>2</div>
        </Grid.Item>
        <Grid.Item columnSpan={3}>
          <div className={ContentClass}>3</div>
        </Grid.Item>
        <Grid.Item columnSpan={3}>
          <div className={ContentClass}>4</div>
        </Grid.Item>
        <Grid.Item columnSpan={12} rowSpan={3}>
          <div className={ContentClass}>5</div>
        </Grid.Item>
        <Grid.Item>
          <div className={ContentClass}>6</div>
        </Grid.Item>
        <Grid.Item>
          <div className={ContentClass}>7</div>
        </Grid.Item>
      </Grid.Root>
    </>
  ),
};
