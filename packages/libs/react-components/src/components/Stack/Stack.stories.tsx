import { styled } from '../../styles/stitches.config';

import { Stack } from './Stack';
import * as variants from './variants';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const Item = styled('div', {
  backgroundColor: '$background',
  size: '$32',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const meta: Meta<typeof Stack> = {
  title: 'Stack',
  component: Stack,
  argTypes: {
    spacing: {
      options: Object.keys(
        variants.spacing,
      ) as (keyof typeof variants.spacing)[],
      control: { type: 'select' },
    },
    justifyContent: {
      options: Object.keys(
        variants.justifyContent,
      ) as (keyof typeof variants.justifyContent)[],
      control: { type: 'select' },
    },
    alignItems: {
      options: Object.keys(
        variants.alignItems,
      ) as (keyof typeof variants.alignItems)[],
      control: { type: 'select' },
    },
    direction: {
      options: Object.keys(
        variants.direction,
      ) as (keyof typeof variants.direction)[],
      control: { type: 'select' },
    },
    flexWrap: {
      options: Object.keys(
        variants.flexWrap,
      ) as (keyof typeof variants.flexWrap)[],
      control: { type: 'select' },
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
        <Item>Item 1</Item>
        <Item>Item 2</Item>
        <Item>Item 3</Item>
        <Item>Item 4</Item>
        <Item>Item 5</Item>
        <Item>Item 6</Item>
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
        <Item>Item 1</Item>
        <Item>Item 2</Item>
        <Item>Item 3</Item>
        <Item>Item 4</Item>
        <Item>Item 5</Item>
        <Item>Item 6</Item>
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
        <Item css={{ size: '$40' }}>Item 1</Item>
        <Item css={{ size: '$12' }}>Item 2</Item>
        <Item css={{ size: '$40' }}>Item 3</Item>
        <Item css={{ size: '$20' }}>Item 4</Item>
        <Item css={{ size: '$40' }}>Item 5</Item>
        <Item css={{ size: '$40' }}>Item 6</Item>
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
        <Item css={{ size: '$40' }}>Item 1</Item>
        <Item css={{ size: '$12' }}>Item 2</Item>
        <Item css={{ size: '$40' }}>Item 3</Item>
        <Item css={{ size: '$20' }}>Item 4</Item>
        <Item css={{ size: '$40' }}>Item 5</Item>
        <Item css={{ size: '$40' }}>Item 6</Item>
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
        <Item css={{ width: '$64' }}>Item 1</Item>
        <Item css={{ width: '$64' }}>Item 2</Item>
        <Item css={{ width: '$64' }}>Item 3</Item>
        <Item css={{ width: '$64' }}>Item 4</Item>
        <Item css={{ width: '$64' }}>Item 5</Item>
        <Item css={{ width: '$64' }}>Item 6</Item>
      </Stack>
    </>
  ),
};
