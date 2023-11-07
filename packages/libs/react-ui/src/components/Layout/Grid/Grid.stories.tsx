import { Grid } from '@components/Layout/Grid';
import type { Meta, StoryObj } from '@storybook/react';
import { sprinkles } from '@theme/sprinkles.css';
import { vars } from '@theme/vars.css';
import classNames from 'classnames';
import React from 'react';
import { componentClass, containerClass, itemClass } from '../stories.css';
import type { ResponsiveInputType } from './Grid.css';
import { gapVariants } from './Grid.css';
import type { IGridRootProps } from './GridRoot';

const spaceOptions: (keyof typeof vars.sizes | undefined)[] = [
  undefined,
  ...(Object.keys(vars.sizes) as (keyof typeof vars.sizes)[]),
];
const contentWidthOptions: (keyof typeof vars.contentWidth | undefined)[] = [
  undefined,
  ...(Object.keys(vars.contentWidth) as (keyof typeof vars.contentWidth)[]),
];
const dimensionOptions: string[] = ['100%', 'min-content', 'max-content'];

type StoryType = {
  columnSpan: ResponsiveInputType;
} & IGridRootProps;

const meta: Meta<StoryType> = {
  title: 'Layout/Grid',
  parameters: {
    docs: {
      description: {
        component:
          'The Grid component is an abstraction over css grid that provides `Root` and `Item` subcomponents to compose a grid of equally sized columns.<br><br><i>Note: This component does not support grid templates or columns of varying sizes.</i>',
      },
    },
  },
  component: Grid.Root,
  argTypes: {
    overflow: {
      options: ['hidden', 'visible', 'scroll', 'auto'],
      control: {
        type: 'select',
      },
      description: 'Overflow css property.',
    },
    gap: {
      options: Object.keys(gapVariants) as (keyof typeof gapVariants)[],
      control: { type: 'select' },
      description:
        'Defines the gaps (gutters) between rows and columns with pre-defined size values.',
    },
    columns: {
      control: { type: 'object' },
      description: 'Defines the number of columns.',
      options: {
        xs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        sm: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        md: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        lg: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        xl: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        xxl: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
    },
    columnSpan: {
      control: { type: 'object' },
      description: 'Defines the column span.',
      options: {
        xs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        sm: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        md: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        lg: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        xl: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        xxl: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
    },
    margin: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Set value for margin property with pre-defined size values.',
    },
    marginX: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Set value for margin property on X axis with pre-defined size values.',
    },
    marginY: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Set value for margin property on Y axis with pre-defined size values.',
    },
    marginTop: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Set value for top margin property with pre-defined size values.',
    },
    marginBottom: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Set value for top margin property with pre-defined size values.',
    },

    marginLeft: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Set value for left margin property with pre-defined size values.',
    },
    marginRight: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Set value for right margin property with pre-defined size values.',
    },
    padding: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Set value for padding property with pre-defined size values.',
    },
    paddingX: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Set value for padding property on X axis with pre-defined size values.',
    },
    paddingY: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Set value for padding property on Y axis with pre-defined size values.',
    },
    paddingTop: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Set value for top padding property with pre-defined size values.',
    },
    paddingBottom: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Set value for bottom padding property with pre-defined size values.',
    },
    paddingLeft: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Set value for left padding property with pre-defined size values.',
    },
    paddingRight: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Set value for right padding property with pre-defined size values.',
    },
    width: {
      options: [...spaceOptions, ...dimensionOptions, ...contentWidthOptions],
      control: {
        type: 'select',
      },
      description: 'Value for width property with pre-defined size values.',
    },
    minWidth: {
      options: dimensionOptions,
      control: {
        type: 'select',
      },
      description: 'Value for minWidth property with pre-defined size values.',
    },
    maxWidth: {
      options: [...dimensionOptions, ...contentWidthOptions],
      control: {
        type: 'select',
      },
      description: 'Value for maxWidth property with pre-defined size values.',
    },
    height: {
      options: [...spaceOptions, ...dimensionOptions],
      control: {
        type: 'select',
      },
      description: 'Value for height property with pre-defined size values.',
    },
    minHeight: {
      options: dimensionOptions,
      control: {
        type: 'select',
      },
      description: 'Value for minHeight property with pre-defined size values.',
    },
    maxHeight: {
      options: dimensionOptions,
      control: {
        type: 'select',
      },
      description: 'Value for maxHeight property with pre-defined size values.',
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
  minHeight: undefined,
  maxHeight: undefined,
  margin: undefined,
  marginX: undefined,
  marginY: undefined,
  marginTop: undefined,
  marginBottom: undefined,
  marginLeft: undefined,
  marginRight: undefined,
  gap: undefined,
  columns: undefined,
  padding: undefined,
  paddingX: undefined,
  paddingY: undefined,
  paddingTop: undefined,
  paddingBottom: undefined,
  paddingLeft: undefined,
  paddingRight: undefined,
  overflow: undefined,
};

export const GridRoot: Story = {
  name: 'Grid',
  args: {
    ...defaultArgs,
    gap: '$xl',
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
      <Grid.Root
        gap={gap}
        columns={columns}
        className={componentClass}
        {...rest}
      >
        {Array.from(new Array(12)).map((empty, i) => (
          <Grid.Item key={i} className={itemClass}>
            <div className={itemClass}>{i}</div>
          </Grid.Item>
        ))}

        <Grid.Item className={itemClass}>
          <div className={itemClass}>2</div>
        </Grid.Item>
        <Grid.Item className={itemClass}>
          <div className={itemClass}>3</div>
        </Grid.Item>
        <Grid.Item className={itemClass}>
          <div className={itemClass}>4</div>
        </Grid.Item>
        <Grid.Item className={itemClass}>
          <div className={itemClass}>5</div>
        </Grid.Item>
        <Grid.Item className={itemClass}>
          <div className={itemClass}>6</div>
        </Grid.Item>
        <Grid.Item className={itemClass}>
          <div className={itemClass}>7</div>
        </Grid.Item>

        <Grid.Item className={itemClass}>
          <div className={itemClass}>8</div>
        </Grid.Item>
      </Grid.Root>
    </div>
  ),
};

export const GridItem: Story = {
  args: {
    ...defaultArgs,
    gap: '$xl',
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
      <Grid.Root
        gap={gap}
        columns={columns}
        className={componentClass}
        {...rest}
      >
        <Grid.Item
          className={classNames(
            itemClass,
            sprinkles({ bg: '$primaryHighContrast' }),
          )}
          columnSpan={columnSpan}
        >
          dynamic
        </Grid.Item>
        {Array.from(new Array(12)).map((empty, i) => (
          <Grid.Item key={i} columnSpan={1} className={itemClass}>
            1
          </Grid.Item>
        ))}
      </Grid.Root>
    </div>
  ),
};
