import type { IButtonProps } from './Button';
import { Button } from './Button';
import { colorVariants, iconLoadingClass } from './Button.css';
import { ButtonIcon } from './ButtonIcon';

import { SystemIcon } from '@components/Icon';
import type { Meta, StoryObj } from '@storybook/react';
import cx from 'classnames';
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
    variant: {
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
      if: { arg: 'as', eq: 'button' },
    },
  },
};

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
    variant: 'primary',
    disabled: false,
    href: 'https://kadena.io',
    iconAlign: 'right',
    loading: false,
    target: '_self',
    icon: undefined,
    text: 'Click me',
    title: 'test title',
  },
  render: ({
    as,
    variant = 'primary',
    disabled,
    href,
    iconAlign = 'right',
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

    const iconClassname = cx({
      [iconLoadingClass]: loading,
    });

    const buttonChildren = (
      <>
        {Icon && iconAlign === 'left' && (
          <ButtonIcon icon={Icon} className={iconClassname} />
        )}
        {text}
        {Icon && iconAlign === 'right' && (
          <ButtonIcon icon={Icon} className={iconClassname} />
        )}
      </>
    );

    return (
      <Button
        as={as}
        disabled={disabled}
        href={href}
        loading={loading}
        onClick={onClick}
        target={target}
        title={title}
        variant={variant}
      >
        {buttonChildren}
      </Button>
    );
  },
};

export default meta;
