import { itemClass, itemSizeClass } from './stories.css';

import { Stack } from '@components/Stack';
import type { Meta, StoryObj } from '@storybook/react';
import type { Sprinkles } from '@theme/sprinkles.css';
import { vars } from '@theme/vars.css';
import className from 'classnames';
import React from 'react';

const spaceOptions: (keyof typeof vars.sizes | undefined)[] = [
  undefined,
  ...(Object.keys(vars.sizes) as (keyof typeof vars.sizes)[]),
];

const meta: Meta<typeof Stack> = {
  title: 'Layout/Stack',
  component: Stack,
  argTypes: {
    margin: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
    },
    marginX: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
    },
    marginY: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
    },
    marginTop: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
    },
    marginBottom: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
    },
    marginLeft: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
    },
    marginRight: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
    },
    gap: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
    },
    justifyContent: {
      options: [
        'flex-start',
        'center',
        'flex-end',
        'space-around',
        'space-between',
      ] as Sprinkles['justifyContent'][],
      control: { type: 'select' },
    },
    alignItems: {
      options: [
        'flex-start',
        'center',
        'flex-end',
        'stretch',
      ] as Sprinkles['alignItems'][],
      control: { type: 'select' },
    },
    direction: {
      options: [
        'row',
        'row-reverse',
        'column',
        'column-reverse',
      ] as Sprinkles['flexDirection'][],
      control: { type: 'select' },
    },
    wrap: {
      options: ['wrap', 'nowrap'] as Sprinkles['flexWrap'][],
      control: { type: 'select' },
    },
    padding: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
    },
    paddingX: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
    },
    paddingY: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
    },
    paddingTop: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
    },
    paddingBottom: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
    },
    paddingLeft: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
    },
    paddingRight: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stack>;

export const Horizontal: Story = {
  name: 'Horizontal Stack',
  args: {
    gap: '$md',
    direction: 'row',
  },
  render: ({ gap, direction }) => (
    <>
      <Stack gap={gap} direction={direction}>
        <div className={itemClass}>Item 1</div>
        <div className={itemClass}>Item 2</div>
        <div className={itemClass}>Item 3</div>
        <div className={itemClass}>Item 4</div>
        <div className={itemClass}>Item 5</div>
        <div className={itemClass}>Item 6</div>
      </Stack>
    </>
  ),
};

export const Vertical: Story = {
  name: 'Vertical Stack',
  args: {
    gap: '$md',
    direction: 'column',
  },
  render: ({ gap, direction }) => (
    <>
      <Stack gap={gap} direction={direction}>
        <div className={itemClass}>Item 1</div>
        <div className={itemClass}>Item 2</div>
        <div className={itemClass}>Item 3</div>
        <div className={itemClass}>Item 4</div>
        <div className={itemClass}>Item 5</div>
        <div className={itemClass}>Item 6</div>
      </Stack>
    </>
  ),
};

export const Centered: Story = {
  name: 'Align Items Center Stack',
  args: {
    gap: '$md',
    direction: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  render: ({ gap, direction, alignItems, justifyContent }) => (
    <>
      <Stack
        gap={gap}
        direction={direction}
        alignItems={alignItems}
        justifyContent={justifyContent}
      >
        <div className={className(itemClass, itemSizeClass.$40)}>Item 1</div>
        <div className={className(itemClass, itemSizeClass.$12)}>Item 2</div>
        <div className={className(itemClass, itemSizeClass.$40)}>Item 3</div>
        <div className={className(itemClass, itemSizeClass.$24)}>Item 4</div>
        <div className={className(itemClass, itemSizeClass.$40)}>Item 5</div>
        <div className={className(itemClass, itemSizeClass.$40)}>Item 6</div>
      </Stack>
    </>
  ),
};

export const SpaceBetween: Story = {
  name: 'Space Between Stack',
  args: {
    gap: '$md',
    direction: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  render: ({ gap, direction, alignItems, justifyContent }) => (
    <>
      <Stack
        gap={gap}
        direction={direction}
        alignItems={alignItems}
        justifyContent={justifyContent}
      >
        <div className={className(itemClass, itemSizeClass.$40)}>Item 1</div>
        <div className={className(itemClass, itemSizeClass.$12)}>Item 2</div>
        <div className={className(itemClass, itemSizeClass.$40)}>Item 3</div>
        <div className={className(itemClass, itemSizeClass.$20)}>Item 4</div>
        <div className={className(itemClass, itemSizeClass.$40)}>Item 5</div>
        <div className={className(itemClass, itemSizeClass.$40)}>Item 6</div>
      </Stack>
    </>
  ),
};

export const Wrapped: Story = {
  name: 'Wrapped Stack',
  args: {
    gap: '$md',
    direction: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    wrap: 'wrap',
  },
  render: ({ gap, direction, alignItems, justifyContent, wrap }) => (
    <>
      <Stack
        gap={gap}
        direction={direction}
        alignItems={alignItems}
        justifyContent={justifyContent}
        wrap={wrap}
      >
        <div className={className(itemClass, itemSizeClass.$64)}>Item 1</div>
        <div className={className(itemClass, itemSizeClass.$64)}>Item 2</div>
        <div className={className(itemClass, itemSizeClass.$64)}>Item 3</div>
        <div className={className(itemClass, itemSizeClass.$64)}>Item 4</div>
        <div className={className(itemClass, itemSizeClass.$64)}>Item 5</div>
        <div className={className(itemClass, itemSizeClass.$64)}>Item 6</div>
      </Stack>
    </>
  ),
};
