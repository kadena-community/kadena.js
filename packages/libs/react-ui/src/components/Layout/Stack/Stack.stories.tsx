import type { Meta, StoryObj } from '@storybook/react';
import className from 'classnames';
import React from 'react';
import { onLayer2 } from '../../../storyDecorators';
import { componentClass, containerClass, itemClass } from '../stories.css';
import {
  Legend,
  defaultBoxArgs,
  sharedStoryArgTypes,
} from '../storyComponents';
import { Stack } from './Stack';
import { itemSizeClass } from './stories.css';

const meta: Meta<typeof Stack> = {
  title: 'Layout/Stack',
  component: Stack,
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
      type: 'Done',
    },
    docs: {
      description: {
        component:
          'This layout component is just a simplified abstraction on flexbox. It allows you to use basic flex properties, but does not offer the full flexibility of flexbox.',
      },
    },
  },
  argTypes: {
    ...sharedStoryArgTypes,
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

export const Horizontal: Story = {
  name: 'Horizontal Stack',
  args: {
    ...defaultBoxArgs,
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
    ...defaultBoxArgs,
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
    ...defaultBoxArgs,
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
    ...defaultBoxArgs,
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
    ...defaultBoxArgs,
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
