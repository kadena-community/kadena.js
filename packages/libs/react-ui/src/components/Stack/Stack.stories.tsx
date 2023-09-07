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
  parameters: {
    docs: {
      description: {
        component:
          'This layout component is just a simplified abstraction on flexbox. It allows you to use basic flex properties, but does not offer the full flexibility of flexbox.',
      },
    },
  },
  component: Stack,
  argTypes: {
    margin: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description: 'Value for margin property with pre-defined size values.',
    },
    marginX: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for margin property on X axis with pre-defined size values.',
    },
    marginY: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for margin property on Y axis with pre-defined size values.',
    },
    marginTop: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for top margin property with pre-defined size values.',
    },
    marginBottom: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for top margin property with pre-defined size values.',
    },

    marginLeft: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for left margin property with pre-defined size values.',
    },
    marginRight: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for right margin property with pre-defined size values.',
    },
    gap: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Defines the gaps between rows and columns with pre-defined size values.',
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
      description:
        'Defines how the browser distributes space between and around content items along the main-axis of a flex container',
    },
    alignItems: {
      options: [
        'flex-start',
        'center',
        'flex-end',
        'stretch',
      ] as Sprinkles['alignItems'][],
      control: { type: 'select' },
      description: 'Controls the alignment of items on the cross axis',
    },
    direction: {
      options: [
        'row',
        'row-reverse',
        'column',
        'column-reverse',
      ] as Sprinkles['flexDirection'][],
      control: { type: 'select' },
      description:
        'Controls the flex direction of text, table columns, and horizontal overflow.',
    },
    wrap: {
      options: ['wrap', 'nowrap'] as Sprinkles['flexWrap'][],
      control: { type: 'select' },
      description:
        'Sets whether flex items are forced onto one line or can wrap onto multiple lines.',
    },
    padding: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description: 'Value for padding property with pre-defined size values.',
    },
    paddingX: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for padding property on X axis with pre-defined size values.',
    },
    paddingY: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for padding property on Y axis with pre-defined size values.',
    },
    paddingTop: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for top padding property with pre-defined size values.',
    },
    paddingBottom: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for bottom padding property with pre-defined size values.',
    },
    paddingLeft: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for left padding property with pre-defined size values.',
    },
    paddingRight: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for right padding property with pre-defined size values.',
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
