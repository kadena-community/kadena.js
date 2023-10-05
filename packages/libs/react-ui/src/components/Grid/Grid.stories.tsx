import type { ResponsiveInputType } from './Grid.css';
import { gapVariants } from './Grid.css';
import type { IGridRootProps } from './GridRoot';
import { ContentClass } from './stories.css';

import { Grid } from '@components/Grid';
import type { Meta, StoryObj } from '@storybook/react';
import { sprinkles } from '@theme/sprinkles.css';
import { vars } from '@theme/vars.css';
import classNames from 'classnames';
import React from 'react';

const selectOptions: (keyof typeof vars.sizes | undefined)[] = [
  undefined,
  ...(Object.keys(vars.sizes) as (keyof typeof vars.sizes)[]),
];

const meta: Meta<
  {
    columnSpan: ResponsiveInputType;
  } & IGridRootProps
> = {
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
      options: selectOptions,
      control: {
        type: 'select',
      },
      description:
        'Set value for margin property with pre-defined size values.',
    },
    marginX: {
      options: selectOptions,
      control: {
        type: 'select',
      },
      description:
        'Set value for margin property on X axis with pre-defined size values.',
    },
    marginY: {
      options: selectOptions,
      control: {
        type: 'select',
      },
      description:
        'Set value for margin property on Y axis with pre-defined size values.',
    },
    marginTop: {
      options: selectOptions,
      control: {
        type: 'select',
      },
      description:
        'Set value for top margin property with pre-defined size values.',
    },
    marginBottom: {
      options: selectOptions,
      control: {
        type: 'select',
      },
      description:
        'Set value for top margin property with pre-defined size values.',
    },

    marginLeft: {
      options: selectOptions,
      control: {
        type: 'select',
      },
      description:
        'Set value for left margin property with pre-defined size values.',
    },
    marginRight: {
      options: selectOptions,
      control: {
        type: 'select',
      },
      description:
        'Set value for right margin property with pre-defined size values.',
    },
    padding: {
      options: selectOptions,
      control: {
        type: 'select',
      },
      description:
        'Set value for padding property with pre-defined size values.',
    },
    paddingX: {
      options: selectOptions,
      control: {
        type: 'select',
      },
      description:
        'Set value for padding property on X axis with pre-defined size values.',
    },
    paddingY: {
      options: selectOptions,
      control: {
        type: 'select',
      },
      description:
        'Set value for padding property on Y axis with pre-defined size values.',
    },
    paddingTop: {
      options: selectOptions,
      control: {
        type: 'select',
      },
      description:
        'Set value for top padding property with pre-defined size values.',
    },
    paddingBottom: {
      options: selectOptions,
      control: {
        type: 'select',
      },
      description:
        'Set value for bottom padding property with pre-defined size values.',
    },
    paddingLeft: {
      options: selectOptions,
      control: {
        type: 'select',
      },
      description:
        'Set value for left padding property with pre-defined size values.',
    },
    paddingRight: {
      options: selectOptions,
      control: {
        type: 'select',
      },
      description:
        'Set value for right padding property with pre-defined size values.',
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
      xs: 1,
      sm: 2,
      md: 4,
      lg: 6,
      xl: 10,
      xxl: 12,
    },
    margin: undefined,
    marginX: undefined,
    marginY: undefined,
    marginTop: undefined,
    marginBottom: undefined,
    marginLeft: undefined,
    marginRight: undefined,
    padding: undefined,
    paddingX: undefined,
    paddingY: undefined,
    paddingTop: undefined,
    paddingBottom: undefined,
    paddingLeft: undefined,
    paddingRight: undefined,
  },
  render: ({
    gap,
    columns,
    margin,
    marginX,
    marginY,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    padding,
    paddingX,
    paddingY,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
  }) => (
    <>
      <Grid.Root
        gap={gap}
        columns={columns}
        margin={margin}
        marginX={marginX}
        marginY={marginY}
        marginTop={marginTop}
        marginBottom={marginBottom}
        marginLeft={marginLeft}
        marginRight={marginRight}
        padding={padding}
        paddingX={paddingX}
        paddingY={paddingY}
        paddingTop={paddingTop}
        paddingBottom={paddingBottom}
        paddingLeft={paddingLeft}
        paddingRight={paddingRight}
      >
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
      xs: 5,
      sm: 10,
      md: 6,
      lg: 4,
      xl: 2,
      xxl: 1,
    },
  },
  render: ({ gap, columns, columnSpan }) => (
    <>
      <Grid.Root gap={gap} columns={columns}>
        <Grid.Item columnSpan={columnSpan}>
          <div
            className={classNames(
              ContentClass,
              sprinkles({ bg: '$primaryAccent' }),
            )}
          >
            dynamic
          </div>
        </Grid.Item>
        {Array.from(new Array(12)).map((_, i) => (
          <Grid.Item key={i} columnSpan={1}>
            <div className={ContentClass}>1</div>
          </Grid.Item>
        ))}
      </Grid.Root>
    </>
  ),
};
