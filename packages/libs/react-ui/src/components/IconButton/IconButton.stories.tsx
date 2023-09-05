import { colorVariants } from './IconButton.css';

import { SystemIcon } from '@components/Icon';
import type { IIconButtonProps } from '@components/IconButton';
import { IconButton } from '@components/IconButton';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<IIconButtonProps> = {
  title: 'Components/IconButton',
  component: IconButton,
  argTypes: {
    onClick: {
      action: 'clicked',
      if: { arg: 'as', eq: 'button' },
      table: {
        disable: true,
      },
    },
    icon: {
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
    asChild: {
      description:
        'Allow users to pass on styles, icons, and additional props to the child component. For example when using next/link in Next.js.',
    },
  },
};

export default meta;
type Story = StoryObj<IIconButtonProps>;

export const Primary: Story = {
  name: 'IconButton',
  args: {
    icon: 'Account',
    title: 'test title',
    color: 'default',
  },
  render: ({ icon, onClick, title, color }) => {
    return (
      <IconButton title={title} onClick={onClick} icon={icon} color={color} />
    );
  },
};
