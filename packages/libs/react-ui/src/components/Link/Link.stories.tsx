import { ILinkProps, Link } from './Link';

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
    iconPosition: {
      options: ['left', 'right'],
      control: {
        type: 'select',
      },
    },
    hasIcon: {
      control: {
        type: 'boolean',
      },
    }
  },
};

export default meta;

type Story = StoryObj<ILinkProps>;

export const Primary: Story = {
  name: 'Link',
  args: {
    href: 'https://kadena.io',
    iconPosition: 'right',
    hasIcon: true
  },
  render: ({ href, iconPosition, hasIcon }) => {
    return (
      <>
        <Link href={`${href}?${Date.now()}`} iconPosition={iconPosition} hasIcon={hasIcon}>
          Non-visited
        </Link>
        <Link href={href} iconPosition={iconPosition} hasIcon={hasIcon}>
          Kadena.io
        </Link>
      </>
    );
  },
};
