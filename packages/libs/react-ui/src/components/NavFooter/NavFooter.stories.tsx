import { Target } from './NavFooterLink';

import { SystemIcon } from '@components/Icon';
import { IconType } from '@components/Icon/IconWrapper';
import { NavFooter } from '@components/NavFooter';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<{
  linksCount: number;
  iconsCount: number;
  darkMode: boolean;
}> = {
  title: 'Navigation/NavFooter',
  argTypes: {
    darkMode: {
      control: {
        type: 'boolean',
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

const links: { label: string; href?: string; target?: Target }[] = [
  {
    label: 'Tutorial',
    href: 'https://kadena.io/',
    target: '_self',
  },
  {
    label: 'Documentation',
    href: 'https://kadena.io/',
    target: '_self',
  },
  {
    label: 'Privacy & Policy',
    href: '',
  },
  {
    label: 'Terms of use',
    href: '',
  },
  {
    label: 'Another link',
    href: '',
  },
  {
    label: 'Take me there',
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
type Story = StoryObj<{
  linksCount: number;
  iconsCount: number;
  darkMode: boolean;
}>;

export const Primary: Story = {
  name: 'NavFooter',
  args: {
    linksCount: 4,
    iconsCount: 3,
    darkMode: false,
  },
  render: ({ linksCount, iconsCount, darkMode }) => {
    const linkItems = links.slice(0, linksCount);
    const iconButtons = icons.slice(0, iconsCount);

    return (
      <NavFooter.Root darkMode={darkMode}>
        <NavFooter.Panel>
          {linkItems.map((item, index) => {
            return (
              <NavFooter.Link key={index} href={item.href} target={item.target}>
                {item.label}
              </NavFooter.Link>
            );
          })}
        </NavFooter.Panel>
        <NavFooter.Panel>
          {iconButtons.map((item, index) => {
            return (
              <NavFooter.IconButton
                key={index}
                icon={item.icon}
                text={item.text}
              />
            );
          })}
        </NavFooter.Panel>
      </NavFooter.Root>
    );
  },
};
