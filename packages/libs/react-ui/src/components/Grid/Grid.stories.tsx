import { gapVariants, ResponsiveInputType } from './Grid.css';
import { IGridRootProps } from './GridRoot';
import { ContentClass } from './stories.css';

import { Grid } from '@components/Grid';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<
  {
    columnSpan: ResponsiveInputType;
  } & IGridRootProps
> = {
  title: 'Layout/Grid',
  component: Grid.Root,
  argTypes: {
    gap: {
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
    columnSpan: {
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
type Story = StoryObj<
  {
    columnSpan: ResponsiveInputType;
  } & IGridRootProps
>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/react/api/csf
 * to learn how to use render functions.
 */

export const GridRoot: Story = {
  name: 'Grid',
  args: {
    gap: '$xl',
    columns: {
      sm: 2,
      md: 4,
      lg: 6,
      xl: 10,
      xxl: 12,
    },
  },
  render: ({ gap, columns }) => (
    <>
      <Grid.Root gap={gap} columns={columns}>
        {Array.from(new Array(12)).map((empty, i) => (
          <Grid.Item key={i}>
            <div className={ContentClass}>{i}</div>
          </Grid.Item>
        ))}

        <Grid.Item>
          <div className={ContentClass}>2</div>
        </Grid.Item>
        <Grid.Item>
          <div className={ContentClass}>3</div>
        </Grid.Item>
        <Grid.Item>
          <div className={ContentClass}>4</div>
        </Grid.Item>
        <Grid.Item>
          <div className={ContentClass}>5</div>
        </Grid.Item>
        <Grid.Item>
          <div className={ContentClass}>6</div>
        </Grid.Item>
        <Grid.Item>
          <div className={ContentClass}>7</div>
        </Grid.Item>

        <Grid.Item>
          <div className={ContentClass}>8</div>
        </Grid.Item>
      </Grid.Root>
    </>
  ),
};

export const GridItem: Story = {
  args: {
    gap: '$xl',
    columns: 12,
    columnSpan: {
      sm: 2,
      md: 4,
      lg: 6,
      xl: 10,
      xxl: 12,
    },
  },
  render: ({ gap, columns, columnSpan }) => (
    <>
      <Grid.Root gap={gap} columns={columns}>
        {Array.from(new Array(12)).map((empty, i) => (
          <Grid.Item key={i} columnSpan={columnSpan}>
            <div className={ContentClass}>{i}</div>
          </Grid.Item>
        ))}
      </Grid.Root>
    </>
  ),
};
