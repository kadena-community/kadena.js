import { SystemIcons } from './../../';
import { IconButton, IIconButtonProps } from '.';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<
  {
    title: string;
    selectIcon: keyof typeof SystemIcons;
    color: string;
  } & IIconButtonProps
> = {
  title: 'IconButton',
  argTypes: {
    onClick: { action: 'clicked' },
    selectIcon: {
      options: Object.keys(SystemIcons),
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
      control: {
        type: 'color',
      },
    },
  },
};

export default meta;
type Story = StoryObj<
  {
    title: string;
    selectIcon: keyof typeof SystemIcons;
    color: string;
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
  },
  render: ({ selectIcon, onClick, title, color }) => {
    const Icon = SystemIcons[selectIcon];
    return (
      <>
        <IconButton title={title} onClick={onClick} icon={Icon} color={color} />
      </>
    );
  },
};
