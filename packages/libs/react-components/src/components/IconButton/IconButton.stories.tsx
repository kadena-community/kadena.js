import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import type { IIconButtonProps } from '.';
import { IconButton } from '.';
import { SystemIcons } from './../../';
import { colorVariant } from './styles';

const meta: Meta<
  {
    selectIcon: keyof typeof SystemIcons;
  } & IIconButtonProps
> = {
  title: 'IconButton',
  argTypes: {
    onClick: { action: 'clicked' },
    selectIcon: {
      options: Object.keys(SystemIcons) as (keyof typeof SystemIcons)[],
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
      options: Object.keys(colorVariant) as (keyof typeof colorVariant)[],
      control: {
        type: 'select',
      },
    },
  },
};

export default meta;
type Story = StoryObj<
  {
    selectIcon: keyof typeof SystemIcons;
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
    const Icon = SystemIcons[selectIcon];
    return (
      <>
        <IconButton title={title} onClick={onClick} icon={Icon} color={color} />
      </>
    );
  },
};
