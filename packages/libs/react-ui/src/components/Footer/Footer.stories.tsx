import { Footer, IFooterIconItemProps, IFooterProps } from './index';

import {
  IFooterLinkItemProps,
  Target,
} from '@components/Footer/FooterLinkItem';
import { SystemIcon } from '@components/Icon';
import { IconType } from '@components/Icon/IconWrapper';
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
  title: 'Navigation/Footer',
  argTypes: {
    variant: {
      options: ['web', 'application'],
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
const links: { title: string; href?: string; target?: Target }[] = [
  {
    title: 'Tutorial',
    href: 'https://kadena.io/',
    target: '_self',
  },
  {
    title: 'Documentation',
    href: 'https://kadena.io/',
    target: '_self',
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
    linksCount: 4,
    iconsCount: 3,
    variant: 'web',
  },
  render: ({ linksCount, iconsCount, variant }) => {
    const linkItems = links.slice(0, linksCount);
    const iconButtons = icons.slice(0, iconsCount);

    return (
      <Footer.Root variant={variant}>
        <Footer.Panel>
          {linkItems.map((item, index) => {
            return (
              <Footer.LinkItem key={index} variant={variant}>
                {item.href !== undefined ? (
                  <a href={item.href} target={item.target}>
                    {item.title}
                  </a>
                ) : (
                  <span>{item.title}</span>
                )}
              </Footer.LinkItem>
            );
          })}
        </Footer.Panel>
        <Footer.Panel>
          {iconButtons.map((item, index) => {
            return (
              <Footer.IconItem
                variant={variant}
                key={index}
                icon={item.icon}
                text={item.text}
              />
            );
          })}
        </Footer.Panel>
      </Footer.Root>
    );
  },
};
