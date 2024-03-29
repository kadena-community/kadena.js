import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import type { ILinkProps } from './Link';
import { Link } from './Link';

const meta: Meta<ILinkProps> = {
  title: 'Components/Link',
  component: Link,
  parameters: {
    status: { type: 'releaseCandidate' },
    controls: {
      hideNoControlsWarning: true,
      sort: 'requiredFirst',
    },
    docs: {
      description: {
        component: `The LinkButton component renders an anchor element <a/> which will be styled with the same variants/colors as the Button component.
        <br/><br/>
        To support client side routing make sure to import/use "RouterProvider" from "@kadena/react-ui" see https://react-spectrum.adobe.com/react-aria/routing.html for more info on how to integrate it with NextJS and client side routing.
        `,
      },
    },
  },
  argTypes: {
    onClick: {
      action: 'clicked',
      description: '(deprecated) callback when button is clicked',
      table: {
        disable: true,
      },
    },
    isDisabled: {
      description: 'only used when rendered as button',
      control: {
        type: 'boolean',
      },
    },
    isLoading: {
      description: 'loading state',
      control: {
        type: 'boolean',
      },
    },
    isCompact: {
      description: 'compact button style',
      control: {
        type: 'boolean',
      },
    },
  },
};

type LinkStory = StoryObj<
  {
    text: string;
  } & ILinkProps
>;

export const _Link: LinkStory = {
  args: {
    text: 'Click me',
    variant: 'primary',
    isDisabled: false,
    isCompact: false,
    isLoading: false,
    icon: undefined,
    href: '#',
  },
  render: ({ text, ...props }) => {
    return <Link {...props}>{text}</Link>;
  },
};

export default meta;
