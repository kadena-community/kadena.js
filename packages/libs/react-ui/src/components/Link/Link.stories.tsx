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
  parameters: {
    docs: {
      description: {
        component: `This component provides a styled anchor element that takes an optional icon prop that can be aligned to the left or right of the text.<br><br>
          <i>Note: In times when you need to use a different 'Link' component (like next/link in Next.js), you can wrap it in this component and set the 'asChild' prop to pass on styles, icons, and additional props.</i>`,
      },
    },
  },
  argTypes: {
    href: {
      description:
        "The href prop that is passed to the anchor or child element. If you're using the 'asChild' prop, you can pass the href to the child element and leave it undefined on the Link element. In times when both are defined, the child element href will be used.",
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
      description: 'Align icon to left or right',
      options: ['left', 'right'] as ILinkProps['iconAlign'][],
      control: {
        type: 'radio',
      },
      if: { arg: 'selectIcon', neq: '-' },
    },
    asChild: {
      description:
        "Use this prop when you're using a different Link component and want to pass on styles, icons, and additional props. For example when using next/link in Next.js.",
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
        <Link href={href} target={target} asChild>
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
        <Link asChild>
          <a href={href} target={target}>
            Link asChild
          </a>
        </Link>
      </>
    );
  },
};
