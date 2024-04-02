import type { Meta, StoryObj } from '@storybook/react';
import classNames from 'classnames';
import React from 'react';
import { componentClass, containerClass, itemClass } from '../stories.css';
import {
  Legend,
  defaultBoxArgs,
  sharedStoryArgTypes,
} from '../storyComponents';
import type { IGridProps } from './Grid';
import type { ResponsiveInputType } from './Grid.css';

import { onLayer2 } from '../../../storyDecorators';
import { atoms } from '../../../styles/atoms.css';
import { Grid } from './Grid';
import { GridItem } from './GridItem';

type StoryType = {
  columnSpan: ResponsiveInputType;
} & IGridProps;

const meta: Meta<StoryType> = {
  title: 'Layout/Grid',
  decorators: [
    (story) => (
      <>
        {story()}
        <Legend
          items={[
            { label: 'Margin', color: 'warning' },
            { label: 'Padding + Gap', color: 'positive' },
            { label: 'Content', color: 'info' },
          ]}
        />
      </>
    ),
    onLayer2,
  ],
  parameters: {
    status: {
      type: 'releaseCandidate',
    },
    docs: {
      description: {
        component:
          'The Grid component is an abstraction over css grid that provides `Grid` and `GridItem` components to compose a grid of equally sized columns.<br><br><i>Note: This component does not support grid templates or columns of varying sizes.</i>',
      },
    },
  },
  argTypes: {
    ...sharedStoryArgTypes,
    columns: {
      control: { type: 'object' },
      description: 'Defines the number of columns.',
    },
    columnSpan: {
      control: { type: 'object' },
      description: 'Defines the column span.',
    },
  },
};

export default meta;
type Story = StoryObj<StoryType>;

const {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  display,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  flex,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  alignItems,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  flexDirection,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  justifyContent,
  ...defaultGridArgs
} = defaultBoxArgs;

export const Primary: Story = {
  name: 'Grid',
  args: {
    ...defaultGridArgs,
    gap: 'xl',
    columns: {
      xs: 1,
      sm: 2,
      md: 4,
      lg: 6,
      xl: 10,
      xxl: 12,
    },
  },
  render: ({ gap, columns, ...rest }) => (
    <div className={containerClass}>
      <Grid gap={gap} columns={columns} className={componentClass} {...rest}>
        {Array.from(new Array(12)).map((empty, i) => (
          <GridItem key={i} className={itemClass}>
            {i}
          </GridItem>
        ))}
      </Grid>
    </div>
  ),
};

export const GridItemStory: Story = {
  args: {
    ...defaultGridArgs,
    gap: 'xl',
    columns: 12,
    columnSpan: {
      xs: 5,
      sm: 10,
      md: 6,
      lg: 4,
      xl: 2,
      xxl: 1,
    },
  },
  render: ({ gap, columns, columnSpan, ...rest }) => (
    <div className={containerClass}>
      <Grid gap={gap} columns={columns} className={componentClass} {...rest}>
        <GridItem
          className={classNames(
            itemClass,
            atoms({ backgroundColor: 'brand.secondary.default' }),
          )}
          columnSpan={columnSpan}
        >
          dynamic
        </GridItem>
        {Array.from(new Array(12)).map((empty, i) => (
          <GridItem key={i} columnSpan={1} className={itemClass}>
            1
          </GridItem>
        ))}
      </Grid>
    </div>
  ),
};
