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
    columns: {
      control: { type: 'object' },
      options: {
        sm: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        md: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        lg: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        xl: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        xxl: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
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
    columns: {
      sm: 6,
      md: 12,
      lg: 12,
      xl: 12,
      xxl: 12,
    },
  },
  render: ({ spacing, columns }) => (
    <>
      <Grid.Root spacing={spacing} columns={columns}>
        {Array.from(new Array(12)).map((empty, i) => (
          <Grid.Item key={i}>
            <div className={ContentClass}>{i}</div>
          </Grid.Item>
        ))}

        <Grid.Item
          columnSpan={{
            sm: 6,
            md: 4,
            lg: 3,
          }}
        >
          <div className={ContentClass}>2</div>
        </Grid.Item>
        <Grid.Item
          columnSpan={{
            sm: 6,
            md: 4,
            lg: 3,
          }}
        >
          <div className={ContentClass}>3</div>
        </Grid.Item>
        <Grid.Item
          columnSpan={{
            sm: 6,
            md: 4,
            lg: 3,
          }}
        >
          <div className={ContentClass}>4</div>
        </Grid.Item>
        <Grid.Item
          columnSpan={{
            sm: 6,
            md: 4,
            lg: 3,
          }}
          rowSpan={3}
        >
          <div className={ContentClass}>5</div>
        </Grid.Item>
        <Grid.Item columnSpan={{ md: 1 }}>
          <div className={ContentClass}>6</div>
        </Grid.Item>
        <Grid.Item columnSpan={{ md: 1 }}>
          <div className={ContentClass}>7</div>
        </Grid.Item>

        <Grid.Item columnSpan={12}>
          <div className={ContentClass}>8</div>
        </Grid.Item>
      </Grid.Root>
    </>
  ),
};
