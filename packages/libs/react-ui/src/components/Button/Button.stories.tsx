import type { IButtonProps } from './Button';
import { Button } from './Button';
import { colorVariants } from './Button.css';

import { SystemIcon } from '@components/Icon';
import type { Meta, StoryObj } from '@storybook/react';
import { withCenteredStory } from '@utils/withCenteredStory';
import React from 'react';

const meta: Meta<
  {
    text: string;
  } & IButtonProps
> = {
  title: 'Components/Button',
  component: Button,
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
      if: { arg: 'loading', eq: false },
    },
    iconAlign: {
      description: 'align icon to left or right',
      options: ['left', 'right'] as IButtonProps['iconAlign'][],
      control: {
        type: 'radio',
      },
      if: { arg: 'icon', neq: '-' },
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
    asChild: {
      description:
        'Allow users to pass on styles, icons, and additional props to the child component. For example when using next/link in Next.js.',
    },
  },
};

type Story = StoryObj<
  {
    text: string;
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
    if (loading) {
      icon = 'Loading';
    }

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
        icon={icon}
        iconAlign={iconAlign}
      >
        {text}
      </Button>
    );
  },
};

export default meta;
