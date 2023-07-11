import { colorVariants } from './Button.css';

import { Button, IButtonProps } from '@components/Button';
import { SystemIcon } from '@components/Icon';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<
  {
    selectIcon: keyof typeof SystemIcon;
    text: string;
  } & IButtonProps
> = {
  title: 'Components/Button',
  component: Button.Root,
  argTypes: {
    onClick: { action: 'clicked', if: { arg: 'as', eq: 'button' } },
    selectIcon: {
      options: Object.keys(SystemIcon) as (keyof typeof SystemIcon)[],
      control: {
        type: 'select',
      },
    },
    color: {
      options: Object.keys(colorVariants) as (keyof typeof colorVariants)[],
      control: {
        type: 'select',
      },
    },
    title: {
      control: {
        type: 'text',
      },
    },
    text: {
      description: 'label text',
      control: {
        type: 'text',
      },
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
      control: {
        options: ['blank', 'self'],
        control: { type: 'radio' },
      },
      if: { arg: 'as', eq: 'a' },
    },
    as: {
      description: 'render as button or anchor',
      control: {
        options: ['button', 'a'],
        control: { type: 'radio' },
      },
    },
    disabled: {
      description: 'only used when rendered as button',
      control: {
        type: 'boolean',
      },
      if: { arg: 'as', eq: 'button' },
    },
  },
};

export default meta;
type Story = StoryObj<
  {
    text: string;
    selectIcon: keyof typeof SystemIcon;
  } & IButtonProps
>;

export const Dynamic: Story = {
  name: 'Button',
  args: {
    title: 'test title',
    disabled: false,
    text: 'Click me',
    href: '',
    target: '_self',
    color: undefined,
    as: 'button',
  },
  render: ({ onClick, title, disabled, text, color, href, target, as }) => {
    return (
      <>
        <Button.Root
          title={title}
          disabled={disabled}
          color={color}
          href={href}
          target={target}
          as={as}
          onClick={onClick}
        >
          {text}
        </Button.Root>
      </>
    );
  },
};

export const Primary: Story = {
  args: {
    title: 'Primary Filled',
    disabled: false,
    children: 'Primary Filled',
    color: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    title: 'Secondary Filled',
    disabled: false,
    children: 'Secondary Filled',
    color: 'secondary',
  },
};

export const Tertiary: Story = {
  args: {
    title: 'Tertiary Filled',
    disabled: false,
    children: 'Tertiary Filled',
    color: 'tertiary',
  },
};

export const Info: Story = {
  args: {
    title: 'Info Filled',
    disabled: false,
    children: 'Info Filled',
    color: 'info',
  },
};

export const Positive: Story = {
  args: {
    title: 'Positive Filled',
    disabled: false,
    children: 'Positive Filled',
    color: 'positive',
  },
};

export const Negative: Story = {
  args: {
    title: 'Negative Filled',
    disabled: false,
    children: 'Negative Filled',
    color: 'negative',
  },
};

export const Warning: Story = {
  args: {
    title: 'Warning Filled',
    disabled: false,
    children: 'Warning Filled',
    color: 'warning',
  },
};

export const ButtonIcon: Story = {
  name: 'Button with Icon',
  args: {
    selectIcon: 'Account',
    title: 'test title',
    disabled: false,
    text: 'Click me',
    href: '',
    target: '_self',
    color: undefined,
    as: 'button',
  },
  render: ({
    onClick,
    title,
    disabled,
    text,
    color,
    selectIcon,
    href,
    target,
    as,
  }) => {
    const Icon = SystemIcon[selectIcon];
    return (
      <>
        <Button.Root
          title={title}
          onClick={onClick}
          disabled={disabled}
          color={color}
          href={href}
          target={target}
          as={as}
        >
          <Button.Icon icon={Icon} />
          {text}
        </Button.Root>

        <Button.Root
          title={title}
          onClick={onClick}
          disabled={disabled}
          color={color}
          href={href}
          target={target}
          style={{ marginTop: '10px' }}
          as={as}
        >
          {text}
          <Button.Icon icon={Icon} />
        </Button.Root>
      </>
    );
  },
};
