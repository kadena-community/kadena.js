import { MonoChevronLeft, MonoChevronRight } from '@kadena/react-icons';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import React from 'react';

import { Link } from '.';
import { getVariants } from '../../storyDecorators/getVariants';
import { iconControl } from '../../storyDecorators/iconControl';
import { button } from '../Button/BaseButton/BaseButton.css';
import { Box } from '../Layout/Box/Box';
import type { ILinkProps } from './Link';

const variants = getVariants(button);

const meta: Meta<ILinkProps> = {
  title: 'Components/Link',
  parameters: {
    status: { type: 'releaseCandidate' },
    controls: {
      hideNoControlsWarning: true,
      sort: 'requiredFirst',
    },
    docs: {
      description: {
        component:
          'A link component used for navigating to different pages or sections of the same page',
      },
    },
  },
  argTypes: {
    href: { control: { type: 'text' } },
    icon: iconControl,
    iconPosition: {
      control: {
        type: 'radio',
      },
      options: ['start', 'end'],
    },
    badgeValue: {
      description: 'badge value to be shown after the children',
      control: {
        type: 'text',
      },
    },
    variant: {
      options: variants.variant,
      control: {
        type: 'select',
      },
      description: 'Link style variant',
    },
    isDisabled: {
      description: 'only used when rendered as Link',
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
    loadingLabel: {
      description: 'label to be shown when loading',
      control: {
        type: 'text',
      },
    },
    isCompact: {
      description: 'compact Link style',
      control: {
        type: 'boolean',
      },
    },
    avatarProps: {
      description:
        'Props for the avatar component which can be rendered instead of startIcon',
      control: {
        type: 'boolean',
      },
    },
  },
};

type LinkStory = StoryObj<ILinkProps>;

export const _Link: LinkStory = {
  args: {
    children: 'Hello world',
    variant: 'primary',
  },
  render: (props: ILinkProps) => {
    return <Link {...props}>{props.children}</Link>;
  },
};

export const StartIcon: LinkStory = {
  args: {
    children: 'Hello world',
    variant: 'primary',
    icon: <MonoChevronLeft />,
    iconPosition: 'start',
  },
  render: (props: ILinkProps) => {
    return <Link {...props}>{props.children}</Link>;
  },
};

export const EndIcon: LinkStory = {
  args: {
    children: 'Hello world',
    variant: 'primary',
    icon: <MonoChevronRight />,
  },
  render: (props: ILinkProps) => {
    return <Link {...props}>{props.children}</Link>;
  },
};

export const WithAvatar: LinkStory = {
  args: {
    children: 'Hello world',
    variant: 'primary',
    avatarProps: {
      imageUrl: 'https://via.placeholder.com/150',
      status: 'info',
    },
  },
  render: (props: ILinkProps) => {
    return <Link {...props}>{props.children}</Link>;
  },
};

export const BadgeOnly: LinkStory = {
  args: {
    children: 'Hello world',
    variant: 'primary',
    badgeValue: '6',
  },
  render: (props: ILinkProps) => {
    return <Link {...props}>{props.children}</Link>;
  },
};

export const BadgeAndEndIcon: LinkStory = {
  args: {
    children: 'Hello world',
    variant: 'primary',
    icon: <MonoChevronRight />,
    badgeValue: '6',
  },
  render: (props: ILinkProps) => {
    return <Link {...props}>{props.children}</Link>;
  },
};

export const BadgeAndStartIcon: LinkStory = {
  args: {
    children: 'Hello world',
    variant: 'primary',
    icon: <MonoChevronLeft />,
    iconPosition: 'start',
    badgeValue: '6',
  },
  render: (props: ILinkProps) => {
    return <Link {...props}>{props.children}</Link>;
  },
};

export const IconOnly: LinkStory = {
  args: {
    variant: 'primary',
    icon: <MonoChevronRight />,
  },
  render: (props: ILinkProps) => {
    return <Link {...props}>{props.children}</Link>;
  },
};

export const AllVariants: StoryFn<ILinkProps> = ({
  variant,
  ...props
}: ILinkProps) => (
  <Box gap="xs" display="flex">
    <Box gap="md" display="flex" flexDirection="column" alignItems="center">
      {variants.variant.map((item) => (
        <Link key={item} variant={item as ILinkProps['variant']} {...props}>
          {props.children || item}
        </Link>
      ))}
    </Box>
  </Box>
);

export default meta;
