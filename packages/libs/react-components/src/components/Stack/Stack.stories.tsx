import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { styled } from '../../styles/stitches.config';
import {
  Stack,
  alignItemsVariant,
  directionVariant,
  flexWrapVariant,
  justifyContentVariant,
  spacingVariant,
} from './Stack';

const Item = styled('div', {
  backgroundColor: '$primarySurface',
  color: '$foreground',
  size: '$32',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '$sm',
});

const meta: Meta<typeof Stack> = {
  title: 'Layout/Stack',
  component: Stack,
  argTypes: {
    gap: {
      options: Object.keys(spacingVariant) as (keyof typeof spacingVariant)[],
      control: { type: 'select' },
    },
    justifyContent: {
      options: Object.keys(
        justifyContentVariant,
      ) as (keyof typeof justifyContentVariant)[],
      control: { type: 'radio' },
    },
    alignItems: {
      options: Object.keys(
        alignItemsVariant,
      ) as (keyof typeof alignItemsVariant)[],
      control: { type: 'radio' },
    },
    direction: {
      options: Object.keys(
        directionVariant,
      ) as (keyof typeof directionVariant)[],
      control: { type: 'radio' },
    },
    flexWrap: {
      options: Object.keys(flexWrapVariant) as (keyof typeof flexWrapVariant)[],
      control: { type: 'radio' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stack>;

export const Horizontal: Story = {
  name: 'Horizontal Stack',
  args: {
    gap: 'md',
    direction: 'row',
  },
  render: ({ gap, direction }) => (
    <>
      <Stack gap={gap} direction={direction}>
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
    gap: 'md',
    direction: 'column',
  },
  render: ({ gap, direction }) => (
    <>
      <Stack gap={gap} direction={direction}>
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
    gap: 'md',
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
    gap: 'md',
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
    gap: 'md',
    direction: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  render: ({ gap, direction, alignItems, justifyContent, flexWrap }) => (
    <>
      <Stack
        gap={gap}
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
