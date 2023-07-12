import {
  IFooterIconItemProps,
  IFooterLinkItemProps,
  SystemIcon,
} from './../../';
import { colorVariants } from './Footer.css';
import { Footer, IFooterProps } from './index';

import { IconType } from '@components/Icons/IconWrapper';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<
  {
    linksCount: number;
    iconsCount: number;
  } & IFooterProps &
    IFooterLinkItemProps &
    IFooterIconItemProps
> = {
  title: 'Layout/Footer',
  argTypes: {
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
const links: { title: string; href: string }[] = [
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

const icons: (
  | { icon: React.FC<IconType>; text: string }
  | { icon: React.FC<IconType>; text?: undefined }
)[] = [
  {
    icon: SystemIcon.Earth,
    text: 'English',
  },
  {
    icon: SystemIcon.Account,
  },
  {
    icon: SystemIcon.ApplicationBrackets,
  },
  {
    icon: SystemIcon.Information,
  },
  {
    icon: SystemIcon.HelpCircle,
  },
  {
    icon: SystemIcon.MenuOpen,
  },
];

export default meta;
type Story = StoryObj<
  {
    linksCount: number;
    iconsCount: number;
  } & IFooterProps &
    IFooterIconItemProps &
    IFooterLinkItemProps
>;

export const Primary: Story = {
  name: 'Footer',
  args: {
    color: 'default',
    linksCount: 4,
    iconsCount: 3,
  },
  render: ({ color, linksCount, iconsCount }) => {
    const linkItems = links.slice(0, linksCount);
    const iconButtons = icons.slice(0, iconsCount);
    return (
      <Footer.Root>
        <Footer.Panel>
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
        <Footer.Panel>
          {iconButtons.map((item, index) => {
            return (
              <Footer.IconItem
                key={index}
                icon={item.icon}
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
