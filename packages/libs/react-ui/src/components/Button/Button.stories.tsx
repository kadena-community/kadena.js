import { colorVariants } from './Button.css';
import { ButtonIcon } from './ButtonIcon';
import { Button, IButtonProps } from '.';

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
  component: Button,
  parameters: {
    controls: {
      hideNoControlsWarning: true,
      sort: 'requiredFirst',
    },
  },
  argTypes: {
    onClick: { action: 'clicked', if: { arg: 'as', eq: 'button' } },
    icon: {
      options: [
        ...['-'],
        ...Object.keys(SystemIcon),
      ] as (keyof typeof SystemIcon)[],
      control: {
        type: 'select',
      },
      if: { arg: 'loading', eq: false },
    },
    iconAlign: {
      description: 'align icon to left or right',
      options: ['left', 'right'] as IButtonProps['iconAlign'][],
      control: {
        type: 'radio',
      },
      if: { arg: 'selectIcon', neq: '-' },
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
      options: ['_blank', '_self'] as IButtonProps['target'][],
      control: {
        type: 'radio',
      },
      if: { arg: 'as', eq: 'a' },
    },
    as: {
      description: 'render as button or anchor',
      options: ['button', 'a'] as IButtonProps['as'][],
      control: {
        type: 'radio',
      },
    },
    disabled: {
      description: 'only used when rendered as button',
      control: {
        type: 'boolean',
      },
      if: { arg: 'as', eq: 'button' },
    },
    loading: {
      description: 'loading state',
      control: {
        type: 'boolean',
      },
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
    as: 'button',
    color: undefined,
    disabled: false,
    href: '',
    iconAlign: 'left',
    loading: false,
    target: '_self',
    icon: undefined,
    text: 'Click me',
    title: 'test title',
  },
  render: ({
    as,
    color,
    disabled,
    href,
    iconAlign,
    loading,
    onClick,
    icon,
    target,
    text,
    title,
  }) => {
    let Icon = icon && SystemIcon[icon];
    if (loading) {
      Icon = SystemIcon.Loading;
    }
    return (
      <>
        <Button
          as={as}
          color={color}
          disabled={disabled}
          href={href}
          onClick={onClick}
          target={target}
          title={title}
          data-loading={loading}
        >
          {Icon && iconAlign === 'left' && <ButtonIcon icon={Icon} />}
          {text}
          {Icon && iconAlign === 'right' && <ButtonIcon icon={Icon} />}
        </Button>
      </>
    );
  },
};
