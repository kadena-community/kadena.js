import { Grid, GridItem } from '@components/Layout/Grid';
import { onLayer2 } from '@storyDecorators';
import type { Meta, StoryObj } from '@storybook/react';
import { atoms } from '@theme/atoms.css';
import { tokens } from '@theme/tokens/contract.css';
import classNames from 'classnames';
import React from 'react';
import { componentClass, containerClass, itemClass } from '../stories.css';
import type { IGridProps } from './Grid';
import type { ResponsiveInputType } from './Grid.css';

const spaceOptions = [undefined, ...Object.keys(tokens.kda.foundation.spacing)];
const marginOptions = [...spaceOptions, 'auto'];

type StoryType = {
  columnSpan: ResponsiveInputType;
} & IGridProps;

const meta: Meta<StoryType> = {
  title: 'Layout/Grid',
  component: Grid,
  decorators: [onLayer2],
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
    overflow: {
      options: ['hidden', 'visible', 'scroll', 'auto'],
      control: {
        type: 'select',
      },
      description: 'Overflow css property.',
    },
    gap: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
    },
    columns: {
      control: { type: 'object' },
      description: 'Defines the number of columns.',
    },
    columnSpan: {
      control: { type: 'object' },
      description: 'Defines the column span.',
    },
    width: {
      options: [undefined, '100%'],
      control: {
        type: 'select',
      },
    },
    minWidth: {
      options: [undefined, 'content.minWidth'],
      control: {
        type: 'select',
      },
    },
    maxWidth: {
      options: [undefined, 'content.maxWidth'],
      control: {
        type: 'select',
      },
    },
    height: {
      options: [undefined, '100%'],
      control: {
        type: 'select',
      },
    },
    margin: {
      options: marginOptions,
      control: {
        type: 'select',
      },
    },
    marginInline: {
      options: marginOptions,
      control: {
        type: 'select',
      },
    },
    marginBlock: {
      options: marginOptions,
      control: {
        type: 'select',
      },
    },
    marginBlockStart: {
      options: marginOptions,
      control: {
        type: 'select',
      },
    },
    marginBlockEnd: {
      options: marginOptions,
      control: {
        type: 'select',
      },
    },
    marginInlineStart: {
      options: marginOptions,
      control: {
        type: 'select',
      },
    },
    marginInlineEnd: {
      options: marginOptions,
      control: {
        type: 'select',
      },
    },
    padding: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
    },
    paddingInline: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
    },
    paddingBlock: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
    },
    paddingBlockStart: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
    },
    paddingBlockEnd: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
    },
    paddingInlineStart: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
    },
    paddingInlineEnd: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryType>;

const defaultArgs: Record<string, string | undefined> = {
  width: undefined,
  minWidth: undefined,
  maxWidth: undefined,
  height: undefined,
  margin: undefined,
  marginInline: undefined,
  marginBlock: undefined,
  marginBlockStart: undefined,
  marginBlockEnd: undefined,
  marginInlineStart: undefined,
  marginInlineEnd: undefined,
  gap: undefined,
  columns: undefined,
  padding: undefined,
  paddingInline: undefined,
  paddingBlock: undefined,
  paddingBlockStart: undefined,
  paddingBlockEnd: undefined,
  paddingInlineStart: undefined,
  paddingInlineEnd: undefined,
  overflow: undefined,
};

export const Primary: Story = {
  name: 'Grid',
  args: {
    ...defaultArgs,
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
    ...defaultArgs,
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
