import { colorVariants } from './IconButton.css';

import { SystemIcon } from '@components/Icon';
import type { IIconButtonProps } from '@components/IconButton';
import { IconButton } from '@components/IconButton';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<
  {
    selectIcon: keyof typeof SystemIcon;
  } & IIconButtonProps
> = {
  title: 'Components/IconButton',
  argTypes: {
    onClick: { action: 'clicked' },
    selectIcon: {
      options: Object.keys(SystemIcon) as (keyof typeof SystemIcon)[],
      control: {
        type: 'select',
      },
    },
    title: {
      control: {
        type: 'text',
      },
    },
    color: {
      options: Object.keys(colorVariants) as (keyof typeof colorVariants)[],
      control: {
        type: 'select',
      },
    },
  },
};

export default meta;
type Story = StoryObj<
  {
    selectIcon: keyof typeof SystemIcon;
  } & IIconButtonProps
>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/react/api/csf
 * to learn how to use render functions.
 */

export const Primary: Story = {
  name: 'IconButton',
  args: {
    selectIcon: 'Account',
    title: 'test title',
    color: 'default',
  },
  render: ({ selectIcon, onClick, title, color }) => {
    return (
      <IconButton
        title={title}
        onClick={onClick}
        icon={selectIcon}
        color={color}
      />
    );
  },
};
