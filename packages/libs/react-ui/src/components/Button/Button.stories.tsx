import { SystemIcon } from '@components/Icon';
import type { Meta, Story, StoryDefault } from '@ladle/react';
import { withCenteredStory } from '@utils/withCenteredStory';
import React from 'react';
import type { IButtonProps } from './Button';
import { Button } from './Button';
import { colorVariants, typeVariants } from './Button.css';

const meta: StoryDefault = {
  title: 'Components/Button',
  decorators: [withCenteredStory],
  parameters: {
    controls: {
      hideNoControlsWarning: true,
      sort: 'requiredFirst',
    },
    docs: {
      description: {
        component:
          'The Button component renders a clickable element that can either be a button or anchor which will be styled according to the variant prop (`primary` being the default).<br /><br />The Button component can include an icon<sup>*</sup> which can be aligned either left or right (default: `right`).<br /><br /><em><sup>*</sup> Please use IconButton when you require a button with only an icon.</em>',
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
      if: { arg: 'loading', eq: false },
    },
    iconAlign: {
      description: 'align icon to left or right',
      options: ['left', 'right'] as IButtonProps['iconAlign'][],
      control: {
        type: 'radio',
      },
      table: {
        type: { summary: 'left | right' },
        defaultValue: { summary: 'right' },
      },
      if: { arg: 'icon', neq: '-' },
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
    variant: {
      options: Object.keys(typeVariants) as (keyof typeof typeVariants)[],
      control: {
        type: 'select',
      },
      description: 'button style variant',
      table: {
        type: { summary: Object.keys(typeVariants).join(' | ') },
        defaultValue: { summary: 'default' },
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
    type: {
      description: 'type of button',
      options: ['button', 'submit', 'reset'] as IButtonProps['type'][],
      control: {
        type: 'select',
      },
      table: {
        type: { summary: 'button | submit | reset' },
        defaultValue: { summary: 'button' },
      },
      if: { arg: 'as', eq: 'button' },
    },
    as: {
      description: 'render as button or anchor',
      options: ['button', 'a'] as IButtonProps['as'][],
      control: {
        type: 'radio',
      },
      table: {
        type: { summary: 'button | a' },
        defaultValue: { summary: 'button' },
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
    active: {
      description: 'set to apply active visual state',
      control: {
        type: 'boolean',
        defaultValue: { summary: false },
      },
    },
    // asChild: {
    //   description:
    //     'Allow users to pass on styles, icons, and additional props to the child component. For example when using next/link in Next.js.',
    // },
  },
};

export const Dynamic: Story<IButtonProps & { text: string }> = ({
  active,
  as,
  color = 'primary',
  disabled,
  href,
  icon,
  iconAlign = 'right',
  loading,
  onClick,
  target,
  text,
  title,
  variant = 'default',
}) => {
  if (loading) {
    icon = 'Loading';
  }

  return (
    <Button
      active={active}
      as={as}
      color={color}
      disabled={disabled}
      href={href}
      icon={icon}
      iconAlign={iconAlign}
      loading={loading}
      onClick={onClick}
      target={target}
      title={title}
      variant={variant}
    >
      {text}
    </Button>
  );
};

Dynamic.args = {
  active: false,
  as: 'button',
  color: 'primary',
  disabled: false,
  href: 'https://kadena.io',
  icon: undefined,
  iconAlign: 'right',
  loading: false,
  target: '_self',
  text: 'Click me',
  title: 'test title',
  variant: 'default',
};

export default meta;
