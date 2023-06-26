import { Meta, StoryObj } from '@storybook/react';
import { ILinkProps, Link } from './Link';
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
  },
};

export default meta;

type Story = StoryObj<ILinkProps>;

export const Primary: Story = {
  name: 'Link',
  args: {
    href: 'https://kadena.io',
    iconPosition: 'right',
  },
  render: ({ href, iconPosition }) => {
    return (
      <>
        <Link href={`${href}?${Date.now()}`} iconPosition={iconPosition}>
          Non-visited
        </Link>
        <Link href={href} iconPosition={iconPosition}>
          Kadena.io
        </Link>
      </>
    );
  },
};
