import { SystemIcon } from '../Icon';

import { ILinkProps, Link } from '@components/Link';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<
  {
    selectIcon: keyof typeof SystemIcon;
  } & ILinkProps
> = {
  title: 'Components/Link',
  component: Link,
  argTypes: {
    href: {
      control: {
        type: 'text',
      },
    },
    target: {
      control: {
        type: 'select',
        options: ['_blank', '_self', '_parent', '_top'],
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
    },
    iconAlign: {
      description: 'align icon to left or right',
      options: ['left', 'right'] as ILinkProps['iconAlign'][],
      control: {
        type: 'radio',
      },
      if: { arg: 'selectIcon', neq: '-' },
    },
  },
};

export default meta;

type Story = StoryObj<
  {
    selectIcon: keyof typeof SystemIcon;
  } & ILinkProps
>;

export const Primary: Story = {
  name: 'Link',
  args: {
    href: 'https://kadena.io',
    target: '_blank',
    icon: 'Link',
    iconAlign: 'left',
  },
  render: ({ href, target, icon, iconAlign }) => {
    return (
      <>
        <Link href={href} target={target}>
          Link without icon
        </Link>
        <Link
          href={`${href}?${Date.now()}`}
          target={target}
          iconAlign={iconAlign}
          icon={icon}
        >
          Non-visited
        </Link>
        <Link href={href} target={target} icon={icon}>
          Kadena.io
        </Link>
      </>
    );
  },
};
