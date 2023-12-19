import { Stack } from '@components/Layout/Stack';
import { onLayer2 } from '@storyDecorators';
import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '@theme/tokens/contract.css';
import className from 'classnames';
import React from 'react';
import { componentClass, containerClass, itemClass } from '../stories.css';
import { itemSizeClass } from './stories.css';

const spaceOptions = [undefined, ...Object.keys(tokens.kda.foundation.spacing)];
const marginOptions = [...spaceOptions, 'auto'];

const meta: Meta<typeof Stack> = {
  title: 'Layout/Stack',
  component: Stack,
  decorators: [onLayer2],
  parameters: {
    status: {
      type: 'releaseCandidate',
    },
    docs: {
      description: {
        component:
          'This layout component is just a simplified abstraction on flexbox. It allows you to use basic flex properties, but does not offer the full flexibility of flexbox.',
      },
    },
  },
  argTypes: {
    overflow: {
      options: ['hidden', 'visible', 'scroll', 'auto'],
      control: {
        type: 'select',
      },
      description: 'Overflow css property',
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
      ],
      control: { type: 'select' },
      description:
        'Defines how the browser distributes space between and around content items along the main-axis of a flex container',
    },
    alignItems: {
      options: ['flex-start', 'center', 'flex-end', 'stretch'],
      control: { type: 'select' },
      description: 'Controls the alignment of items on the cross axis',
    },
    flexDirection: {
      options: ['row', 'row-reverse', 'column', 'column-reverse'],
      control: { type: 'select' },
      description:
        'Controls the flex direction of text, table columns, and horizontal overflow.',
    },
    flexWrap: {
      options: ['wrap', 'nowrap'],
      control: { type: 'select' },
      description:
        'Sets whether flex items are forced onto one line or can wrap onto multiple lines.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stack>;

const defaultArgs: Record<keyof typeof Stack, string | undefined> = {
  width: undefined,
  minWidth: undefined,
  maxWidth: undefined,
  height: undefined,
  minHeight: undefined,
  maxHeight: undefined,
  margin: undefined,
  marginInline: undefined,
  marginBlock: undefined,
  marginBlockStart: undefined,
  marginBlockEnd: undefined,
  marginInlineStart: undefined,
  marginInlineEnd: undefined,
  gap: undefined,
  justifyContent: undefined,
  alignItems: undefined,
  flexDirection: undefined,
  flexWrap: undefined,
  padding: undefined,
  paddingInline: undefined,
  paddingBlock: undefined,
  paddingBlockStart: undefined,
  paddingBlockEnd: undefined,
  paddingInlineStart: undefined,
  paddingInlineEnd: undefined,
  overflow: undefined,
};

export const Horizontal: Story = {
  name: 'Horizontal Stack',
  args: {
    ...defaultArgs,
    gap: 'md',
    flexDirection: 'row',
  },
  render: ({ gap, flexDirection, ...rest }) => {
    return (
      <div className={containerClass}>
        <Stack
          gap={gap}
          flexDirection={flexDirection}
          className={componentClass}
          {...rest}
        >
          <div className={itemClass}>Item 1</div>
          <div className={itemClass}>Item 2</div>
          <div className={itemClass}>Item 3</div>
          <div className={itemClass}>Item 4</div>
          <div className={itemClass}>Item 5</div>
          <div className={itemClass}>Item 6</div>
        </Stack>
      </div>
    );
  },
};

export const Vertical: Story = {
  name: 'Vertical Stack',
  args: {
    ...defaultArgs,
    gap: 'md',
    flexDirection: 'column',
  },
  render: ({ gap, flexDirection, ...rest }) => (
    <div className={containerClass}>
      <Stack
        gap={gap}
        flexDirection={flexDirection}
        className={componentClass}
        {...rest}
      >
        <div className={itemClass}>Item 1</div>
        <div className={itemClass}>Item 2</div>
        <div className={itemClass}>Item 3</div>
        <div className={itemClass}>Item 4</div>
        <div className={itemClass}>Item 5</div>
        <div className={itemClass}>Item 6</div>
      </Stack>
    </div>
  ),
};

export const Centered: Story = {
  name: 'Align Items Center Stack',
  args: {
    ...defaultArgs,
    gap: 'md',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  render: ({ gap, flexDirection, alignItems, justifyContent, ...rest }) => (
    <div className={containerClass}>
      <Stack
        gap={gap}
        flexDirection={flexDirection}
        alignItems={alignItems}
        justifyContent={justifyContent}
        className={componentClass}
        {...rest}
      >
        <div className={className(itemClass, itemSizeClass.$40)}>Item 1</div>
        <div className={className(itemClass, itemSizeClass.$12)}>Item 2</div>
        <div className={className(itemClass, itemSizeClass.$40)}>Item 3</div>
        <div className={className(itemClass, itemSizeClass.$24)}>Item 4</div>
        <div className={className(itemClass, itemSizeClass.$40)}>Item 5</div>
        <div className={className(itemClass, itemSizeClass.$40)}>Item 6</div>
      </Stack>
    </div>
  ),
};

export const SpaceBetween: Story = {
  name: 'Space Between Stack',
  args: {
    ...defaultArgs,
    gap: 'md',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  render: ({ gap, flexDirection, alignItems, justifyContent, ...rest }) => (
    <div className={containerClass}>
      <Stack
        gap={gap}
        flexDirection={flexDirection}
        alignItems={alignItems}
        justifyContent={justifyContent}
        className={componentClass}
        {...rest}
      >
        <div className={className(itemClass, itemSizeClass.$40)}>Item 1</div>
        <div className={className(itemClass, itemSizeClass.$12)}>Item 2</div>
        <div className={className(itemClass, itemSizeClass.$40)}>Item 3</div>
        <div className={className(itemClass, itemSizeClass.$20)}>Item 4</div>
        <div className={className(itemClass, itemSizeClass.$40)}>Item 5</div>
        <div className={className(itemClass, itemSizeClass.$40)}>Item 6</div>
      </Stack>
    </div>
  ),
};

export const Wrapped: Story = {
  name: 'Wrapped Stack',
  args: {
    ...defaultArgs,
    gap: 'md',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  render: ({
    gap,
    flexDirection,
    alignItems,
    justifyContent,
    flexWrap,
    ...rest
  }) => (
    <div className={containerClass}>
      <Stack
        gap={gap}
        flexDirection={flexDirection}
        alignItems={alignItems}
        justifyContent={justifyContent}
        flexWrap={flexWrap}
        className={componentClass}
        {...rest}
      >
        <div className={className(itemClass, itemSizeClass.$64)}>Item 1</div>
        <div className={className(itemClass, itemSizeClass.$64)}>Item 2</div>
        <div className={className(itemClass, itemSizeClass.$64)}>Item 3</div>
        <div className={className(itemClass, itemSizeClass.$64)}>Item 4</div>
        <div className={className(itemClass, itemSizeClass.$64)}>Item 5</div>
        <div className={className(itemClass, itemSizeClass.$64)}>Item 6</div>
      </Stack>
    </div>
  ),
};
