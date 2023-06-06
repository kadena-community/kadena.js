import { Stack } from './Stack';
import {
  alignItemsClass,
  justifyContentClass,
  spacingClass,
} from './Stack.css';
import { item, itemSizeClass } from './stories.css';

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
    direction: 'row',
  },
  render: ({ spacing, direction }) => (
    <>
      <Stack spacing={spacing} direction={direction}>
        <div className={item}>Item 1</div>
        <div className={item}>Item 2</div>
        <div className={item}>Item 3</div>
        <div className={item}>Item 4</div>
        <div className={item}>Item 5</div>
        <div className={item}>Item 6</div>
      </Stack>
    </>
  ),
};

export const Vertical: Story = {
  name: 'Vertical Stack',
  args: {
    spacing: 'md',
    direction: 'column',
  },
  render: ({ spacing, direction }) => (
    <>
      <Stack spacing={spacing} direction={direction}>
        <div className={item}>Item 1</div>
        <div className={item}>Item 2</div>
        <div className={item}>Item 3</div>
        <div className={item}>Item 4</div>
        <div className={item}>Item 5</div>
        <div className={item}>Item 6</div>
      </Stack>
    </>
  ),
};

export const Centered: Story = {
  name: 'Align Items Center Stack',
  args: {
    spacing: 'md',
    direction: 'row',
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
        <div className={className(item, itemSizeClass[40])}>Item 1</div>
        <div className={className(item, itemSizeClass[12])}>Item 2</div>
        <div className={className(item, itemSizeClass[40])}>Item 3</div>
        <div className={className(item, itemSizeClass[24])}>Item 4</div>
        <div className={className(item, itemSizeClass[40])}>Item 5</div>
        <div className={className(item, itemSizeClass[40])}>Item 6</div>
      </Stack>
    </>
  ),
};

export const SpaceBetween: Story = {
  name: 'Space Between Stack',
  args: {
    spacing: 'md',
    direction: 'row',
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
        <div className={className(item, itemSizeClass[40])}>Item 1</div>
        <div className={className(item, itemSizeClass[12])}>Item 2</div>
        <div className={className(item, itemSizeClass[40])}>Item 3</div>
        <div className={className(item, itemSizeClass[20])}>Item 4</div>
        <div className={className(item, itemSizeClass[40])}>Item 5</div>
        <div className={className(item, itemSizeClass[40])}>Item 6</div>
      </Stack>
    </>
  ),
};

export const Wrapped: Story = {
  name: 'Wrapped Stack',
  args: {
    spacing: 'md',
    direction: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
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
        <div className={className(item, itemSizeClass[64])}>Item 1</div>
        <div className={className(item, itemSizeClass[64])}>Item 2</div>
        <div className={className(item, itemSizeClass[64])}>Item 3</div>
        <div className={className(item, itemSizeClass[64])}>Item 4</div>
        <div className={className(item, itemSizeClass[64])}>Item 5</div>
        <div className={className(item, itemSizeClass[64])}>Item 6</div>
      </Stack>
    </>
  ),
};
