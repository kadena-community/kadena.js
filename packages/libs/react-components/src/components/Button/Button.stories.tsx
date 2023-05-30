import { SystemIcons } from './../../';
import { Button, IButtonProps } from '.';

import type { Meta, StoryObj } from '@storybook/react';
import Link from 'next/link';
import React from 'react';

const meta: Meta<
  {
    selectIcon: keyof typeof SystemIcons;
    text: string;
  } & IButtonProps
> = {
  title: 'Button',
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
    text: {
      control: {
        type: 'text',
      },
    },
    disabled: {
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
    selectIcon: keyof typeof SystemIcons;
  } & IButtonProps
>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/react/api/csf
 * to learn how to use render functions.
 */

export const Primary: Story = {
  name: 'Button',
  args: {
    selectIcon: undefined,
    title: 'test title',
    disabled: false,
    text: 'Click me',
  },
  render: ({ selectIcon, onClick, title, disabled, text }) => {
    const Icon = SystemIcons[selectIcon];
    return (
      <>
        <Button title={title} onClick={onClick} icon={Icon} disabled={disabled}>
          {text}
        </Button>
      </>
    );
  },
};

export const Secondary: Story = {
  name: 'LinkButton',
  args: {
    title: 'test title',
    text: 'Click me, I am a link',
    href: 'https://kadena.io',
    selectIcon: undefined,
    disabled: false,
  },
  render: ({ href, text, title, selectIcon, disabled }) => {
    const url = new URL(href!);
    const Icon = SystemIcons[selectIcon!];

    return (
      <>
        <Link href={url} passHref legacyBehavior>
          <Button title={title} as="a" icon={Icon} disabled={disabled}>
            {text}
          </Button>
        </Link>
      </>
    );
  },
};
