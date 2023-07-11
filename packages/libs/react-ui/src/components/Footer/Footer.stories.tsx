import { SystemIcon } from './../../';
import { colorVariants, footerVariants } from './Footer.css';
import { Footer, IFooterProps } from './index';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<
  {
    linksCount: number;
    iconsCount: number;
  } & IFooterProps
> = {
  title: 'Layout/Footer',
  argTypes: {
    variant: {
      options: Object.keys(footerVariants) as (keyof typeof footerVariants)[],
      control: {
        type: 'select',
      },
    },
    color: {
      options: Object.keys(colorVariants) as (keyof typeof colorVariants)[],
      control: {
        type: 'select',
      },
    },
    linksCount: {
      control: { type: 'range', min: 1, max: 6, step: 1 },
    },
    iconsCount: {
      control: { type: 'range', min: 1, max: 6, step: 1 },
    },
  },
};
const links = [
  {
    title: 'Tutorial',
    href: 'https://kadena.io/',
  },
  {
    title: 'Documentation',
    href: 'https://kadena.io/',
  },
  {
    title: 'Privacy & Policy',
    href: '',
  },
  {
    title: 'Terms of use',
    href: '',
  },
  {
    title: 'Another link',
    href: '',
  },
  {
    title: 'Take me there',
    href: '',
  },
];

const icons = [
  {
    icon: SystemIcon.Earth,
    title: 'Language',
    text: 'English',
  },
  {
    icon: SystemIcon.Account,
    title: 'Account',
  },
  {
    icon: SystemIcon.ApplicationBrackets,
    title: 'ApplicationBrackets',
  },
  {
    icon: SystemIcon.Information,
    title: 'Information',
  },
  {
    icon: SystemIcon.HelpCircle,
    title: 'HelpCircle',
  },
  {
    icon: SystemIcon.MenuOpen,
    title: 'MenuOpen',
  },
];

export default meta;
type Story = StoryObj<
  {
    linksCount: number;
    iconsCount: number;
  } & IFooterProps
>;

export const Primary: Story = {
  name: 'Footer',
  args: {
    variant: 'web',
    color: 'default',
    linksCount: 4,
    iconsCount: 3,
  },
  render: ({ variant, color, linksCount, iconsCount }) => {
    const linkItems = links.slice(0, linksCount);
    const iconButtons = icons.slice(0, iconsCount);
    return (
      <Footer.Root variant={variant} color={color}>
        <Footer.Panel variant={variant}>
          {linkItems.map((item, index) => {
            return (
              <Footer.LinkItem
                key={index}
                title={item.title}
                href={item.href}
                color={color}
              />
            );
          })}
        </Footer.Panel>
        <Footer.Panel variant={variant}>
          {iconButtons.map((item, index) => {
            return (
              <Footer.IconItem
                key={index}
                icon={item.icon}
                title={item.title}
                text={item.text}
                color={color}
              />
            );
          })}
        </Footer.Panel>
      </Footer.Root>
    );
  },
};
