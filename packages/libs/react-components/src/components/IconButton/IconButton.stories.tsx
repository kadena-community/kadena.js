import { SystemIcons } from './../../';
import { IconButton, IIConButtonProps } from '.';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<{ selectIcon: keyof typeof SystemIcons } & IIConButtonProps> =
  {
    title: 'IconButton',
    argTypes: {
      onClick: { action: 'clicked' },
      selectIcon: {
        options: Object.keys(SystemIcons),
        control: {
          type: 'select',
        },
      },
    },
  };

export default meta;
type Story = StoryObj<
  { selectIcon: keyof typeof SystemIcons } & IIConButtonProps
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
  },
  render: ({ selectIcon, onClick }) => {
    const Icon = SystemIcons[selectIcon];
    return (
      <>
        <IconButton onClick={onClick} icon={Icon} />
      </>
    );
  },
};
