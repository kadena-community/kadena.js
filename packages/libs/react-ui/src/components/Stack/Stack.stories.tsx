import { Stack } from './Stack';
import {
  alignItemsClass,
  Item,
  ItemSizeClass,
  justifyContentClass,
  spacingClass,
} from './Stack.css';

import type { Meta, StoryObj } from '@storybook/react';
import className from 'classnames';
import React from 'react';

const meta: Meta<typeof Stack> = {
  title: 'Layout/Stack',
  component: Stack,
  argTypes: {
    spacing: {
      options: Object.keys(spacingClass) as (keyof typeof spacingClass)[],
      control: { type: 'select' },
    },
    justifyContent: {
      options: Object.keys(
        justifyContentClass,
      ) as (keyof typeof justifyContentClass)[],
      control: { type: 'radio' },
    },
    alignItems: {
      options: Object.keys(alignItemsClass) as (keyof typeof alignItemsClass)[],
      control: { type: 'radio' },
    },
    direction: {
      control: { type: 'boolean' },
    },
    flexWrap: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stack>;

export const Horizontal: Story = {
  name: 'Horizontal Stack',
  args: {
    spacing: 'md',
    direction: false,
  },
  render: ({ spacing, direction }) => (
    <>
      <Stack spacing={spacing} direction={direction}>
        <div className={Item}>Item 1</div>
        <div className={Item}>Item 2</div>
        <div className={Item}>Item 3</div>
        <div className={Item}>Item 4</div>
        <div className={Item}>Item 5</div>
        <div className={Item}>Item 6</div>
      </Stack>
    </>
  ),
};

export const Vertical: Story = {
  name: 'Vertical Stack',
  args: {
    spacing: 'md',
    direction: true,
  },
  render: ({ spacing, direction }) => (
    <>
      <Stack spacing={spacing} direction={direction}>
        <div className={Item}>Item 1</div>
        <div className={Item}>Item 2</div>
        <div className={Item}>Item 3</div>
        <div className={Item}>Item 4</div>
        <div className={Item}>Item 5</div>
        <div className={Item}>Item 6</div>
      </Stack>
    </>
  ),
};

export const Centered: Story = {
  name: 'Align Items Center Stack',
  args: {
    spacing: 'md',
    direction: false,
    alignItems: 'center',
    justifyContent: 'center',
  },
  render: ({ spacing, direction, alignItems, justifyContent }) => (
    <>
      <Stack
        spacing={spacing}
        direction={direction}
        alignItems={alignItems}
        justifyContent={justifyContent}
      >
        <div className={className(Item, ItemSizeClass[40])}>Item 1</div>
        <div className={className(Item, ItemSizeClass[12])}>Item 2</div>
        <div className={className(Item, ItemSizeClass[40])}>Item 3</div>
        <div className={className(Item, ItemSizeClass[24])}>Item 4</div>
        <div className={className(Item, ItemSizeClass[40])}>Item 5</div>
        <div className={className(Item, ItemSizeClass[40])}>Item 6</div>
      </Stack>
    </>
  ),
};

export const SpaceBetween: Story = {
  name: 'Space Between Stack',
  args: {
    spacing: 'md',
    direction: false,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  render: ({ spacing, direction, alignItems, justifyContent }) => (
    <>
      <Stack
        spacing={spacing}
        direction={direction}
        alignItems={alignItems}
        justifyContent={justifyContent}
      >
        <div className={className(Item, ItemSizeClass[40])}>Item 1</div>
        <div className={className(Item, ItemSizeClass[12])}>Item 2</div>
        <div className={className(Item, ItemSizeClass[40])}>Item 3</div>
        <div className={className(Item, ItemSizeClass[20])}>Item 4</div>
        <div className={className(Item, ItemSizeClass[40])}>Item 5</div>
        <div className={className(Item, ItemSizeClass[40])}>Item 6</div>
      </Stack>
    </>
  ),
};

export const Wrapped: Story = {
  name: 'Wrapped Stack',
  args: {
    spacing: 'md',
    direction: false,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: true,
  },
  render: ({ spacing, direction, alignItems, justifyContent, flexWrap }) => (
    <>
      <Stack
        spacing={spacing}
        direction={direction}
        alignItems={alignItems}
        justifyContent={justifyContent}
        flexWrap={flexWrap}
      >
        <div className={className(Item, ItemSizeClass[64])}>Item 1</div>
        <div className={className(Item, ItemSizeClass[64])}>Item 2</div>
        <div className={className(Item, ItemSizeClass[64])}>Item 3</div>
        <div className={className(Item, ItemSizeClass[64])}>Item 4</div>
        <div className={className(Item, ItemSizeClass[64])}>Item 5</div>
        <div className={className(Item, ItemSizeClass[64])}>Item 6</div>
      </Stack>
    </>
  ),
};
