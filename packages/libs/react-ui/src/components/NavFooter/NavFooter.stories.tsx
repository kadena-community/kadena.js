import type { SystemIcon } from '@components/Icon';
import { NavFooter } from '@components/NavFooter';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import type { Target } from './NavFooterLink';

const meta: Meta<{
  linksCount: number;
  iconsCount: number;
  darkMode: boolean;
}> = {
  title: 'Navigation/NavFooter',
  parameters: {
    docs: {
      description: {
        component:
          'The NavFooter component provides styled bottom bar navigation that be configured with main nav links on the left side and buttons on the right side.<br><br><i>Note: In times when you need to use a different `Link` component (like next/link in Next.js), you can wrap it in the `NavHeader.Link` component and set the `asChild` prop to pass on styles and additional props.</i><br><br><i>In progress: maximum navigation items is currently limited (not technically enforced).<br>Pending design update to support more items.</i>',
      },
    },
  },
  argTypes: {
    darkMode: {
      description:
        'By default the footer switches colors in dark/light mode. This prop allows you to override that behavior and always show dark mode.',
      control: {
        type: 'boolean',
      },
      table: {
        defaultValue: { summary: false },
      },
    },
    linksCount: {
      description: 'Controls to adjust the number of links in the example.',
      control: { type: 'range', min: 1, max: 6, step: 1 },
      table: {
        defaultValue: { summary: 4 },
      },
    },
    iconsCount: {
      description:
        'Controls to adjust the number of icons and buttons in the example.',
      control: { type: 'range', min: 1, max: 6, step: 1 },
      table: {
        defaultValue: { summary: 3 },
      },
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

const icons: { icon: keyof typeof SystemIcon; text?: string }[] = [
  {
    icon: 'Earth',
    text: 'English',
  },
  {
    icon: 'Account',
  },
  {
    icon: 'ApplicationBrackets',
  },
  {
    icon: 'Information',
  },
  {
    icon: 'HelpCircle',
  },
  {
    icon: 'MenuOpen',
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
