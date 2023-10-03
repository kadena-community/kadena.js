import { colorVariants, typeVariants } from './IconButton.css';

import { SystemIcon } from '@components/Icon';
import type { IIconButtonProps } from '@components/IconButton';
import { IconButton } from '@components/IconButton';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<IIconButtonProps> = {
  title: 'Components/IconButton',
  component: IconButton,
  parameters: {
    docs: {
      description: {
        component:
          'Use this variation of the Button component if you require a button with only an icon.',
      },
    },
  },
  argTypes: {
    onClick: {
      action: 'clicked',
      if: { arg: 'as', eq: 'button' },
      table: {
        disable: true,
      },
    },
    icon: {
      options: [
        ...['-'],
        ...Object.keys(SystemIcon),
      ] as (keyof typeof SystemIcon)[],
      control: {
        type: 'select',
      },
      table: {
        type: { summary: Object.keys(SystemIcon).join(' | ') },
      },
    },
    title: {
      control: {
        type: 'text',
      },
      description: 'aria label',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    variant: {
      options: Object.keys(typeVariants) as (keyof typeof typeVariants)[],
      control: {
        type: 'select',
      },
      description: 'button style variant',
      table: {
        type: { summary: Object.keys(typeVariants).join(' | ') },
        defaultValue: { summary: 'compact' },
      },
    },
    color: {
      options: Object.keys(colorVariants) as (keyof typeof colorVariants)[],
      control: {
        type: 'select',
      },
      description: 'color variant',
      table: {
        type: { summary: Object.keys(colorVariants).join(' | ') },
        defaultValue: { summary: 'primary' },
      },
    },
    as: {
      description: 'render as button or anchor',
      options: ['button', 'a'] as IIconButtonProps['as'][],
      control: {
        type: 'radio',
      },
      table: {
        type: { summary: 'button | a' },
        defaultValue: { summary: 'button' },
      },
    },
    type: {
      description: 'type of button',
      options: ['button', 'submit', 'reset'] as IIconButtonProps['type'][],
      control: {
        type: 'select',
      },
      table: {
        type: { summary: 'button | submit | reset' },
        defaultValue: { summary: 'button' },
      },
      if: { arg: 'as', eq: 'button' },
    },
    href: {
      description: 'href is required when rendered as anchor',
      control: {
        type: 'text',
      },
      if: { arg: 'as', eq: 'a' },
    },
    target: {
      description: 'only used when rendered as anchor',
      options: ['_blank', '_self'] as IIconButtonProps['target'][],
      control: {
        type: 'radio',
      },
      if: { arg: 'as', eq: 'a' },
    },
    active: {
      description: 'set to apply active visual state',
      control: {
        type: 'boolean',
        defaultValue: { summary: false },
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

export const Dynamic: Story = {
  name: 'IconButton',
  args: {
    active: false,
    as: 'button',
    color: 'primary',
    icon: 'Account',
    title: 'test title',
    type: 'button',
    variant: 'compact',
  },
  render: ({ active, as, color, icon, onClick, title, type, variant }) => {
    return (
      <IconButton
        active={active}
        as={as}
        color={color}
        icon={icon}
        onClick={onClick}
        title={title}
        type={type}
        variant={variant}
      />
    );
  },
};
