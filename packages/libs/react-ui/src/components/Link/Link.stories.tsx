import { ILinkProps, Link } from '.';

import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<ILinkProps> = {
  title: 'Components/Link',
  component: Link.Root,
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
  },
};

export default meta;

type Story = StoryObj<ILinkProps>;

export const Primary: Story = {
  name: 'Link',
  args: {
    href: 'https://kadena.io',
    target: '_blank',
  },
  render: ({ href, target }) => {
    return (
      <>
        <Link.Root href={href} target={target}>
          Link without icon
        </Link.Root>
        <Link.Root href={`${href}?${Date.now()}`} target={target}>
          <Link.Icon />
          Non-visited
        </Link.Root>
        <Link.Root href={href} target={target}>
          Kadena.io
          <Link.Icon />
        </Link.Root>
      </>
    );
  },
};
