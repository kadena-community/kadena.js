import { SystemIcon } from '../Icon';

import { ILinkProps, Link } from '@components/Link';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<ILinkProps> = {
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
        <Link href={href} target={target}>
          Link without icon
        </Link>
        <Link href={`${href}?${Date.now()}`} target={target}>
          <SystemIcon.Account />
          Non-visited
        </Link>
        <Link href={href} target={target}>
          Kadena.io
          <SystemIcon.Link />
        </Link>
      </>
    );
  },
};
