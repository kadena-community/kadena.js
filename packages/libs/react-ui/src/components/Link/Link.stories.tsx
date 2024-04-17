import { MonoChevronLeft, MonoChevronRight } from '@kadena/react-icons';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import React from 'react';

import { Link } from '.';
import { Avatar, Badge } from '..';
import { getVariants } from '../../storyDecorators/getVariants';
import { iconControl } from '../../storyDecorators/iconControl';
import { button } from '../Button/Button.css';
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
          'The Link component renders an anchor which will be styled according to the variant prop.',
      },
    },
  },
  argTypes: {
    startVisual: iconControl,
    endVisual: iconControl,
    variant: {
      options: variants.variant,
      control: {
        type: 'select',
      },
      description: 'button style variant',
    },
    isDisabled: {
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

export const _Button: LinkStory = {
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
    startVisual: <MonoChevronLeft />,
  },
  render: (props: ILinkProps) => {
    return <Link {...props}>{props.children}</Link>;
  },
};

export const EndIcon: LinkStory = {
  args: {
    children: 'Hello world',
    variant: 'primary',
    endVisual: <MonoChevronRight />,
  },
  render: (props: ILinkProps) => {
    return <Link {...props}>{props.children}</Link>;
  },
};

export const WithAvatar: LinkStory = {
  args: {
    children: 'Hello world',
    variant: 'primary',
    startVisual: <Avatar name="Robin Mulder" color="category3" />,
  },
  render: (props: ILinkProps) => {
    return <Link {...props}>{props.children}</Link>;
  },
};

export const BadgeOnly: LinkStory = {
  args: {
    children: 'Hello world',
    variant: 'primary',
    endVisual: (
      <Badge size="sm" style="inverse">
        6
      </Badge>
    ),
  },
  render: (props: ILinkProps) => {
    return <Link {...props}>{props.children}</Link>;
  },
};

export const BadgeAndEndIcon: LinkStory = {
  args: {
    children: 'Hello world',
    variant: 'primary',
    endVisual: (
      <>
        <Badge size="sm" style="inverse">
          6
        </Badge>
        <MonoChevronRight />
      </>
    ),
  },
  render: (props: ILinkProps) => {
    return <Link {...props}>{props.children}</Link>;
  },
};

export const BadgeAndStartIcon: LinkStory = {
  args: {
    children: 'Hello world',
    variant: 'primary',
    startVisual: <MonoChevronLeft />,
    endVisual: (
      <Badge size="sm" style="inverse">
        6
      </Badge>
    ),
  },
  render: (props: ILinkProps) => {
    return <Link {...props}>{props.children}</Link>;
  },
};

export const IconOnly: LinkStory = {
  args: {
    variant: 'primary',
    children: <MonoChevronRight />,
  },
  render: (props: ILinkProps) => {
    return <Link {...props}>{props.children}</Link>;
  },
};

export const StartVisualLoading: LinkStory = {
  args: {
    variant: 'primary',
    startVisual: <MonoChevronRight />,
    children: 'Hello world',
    isLoading: true,
  },
  render: (props: ILinkProps) => {
    return <Link {...props}>{props.children}</Link>;
  },
};

export const EndVisualLoading: LinkStory = {
  args: {
    variant: 'primary',
    endVisual: <MonoChevronRight />,
    children: 'Hello world',
    isLoading: true,
  },
  render: (props: ILinkProps) => {
    return <Link {...props}>{props.children}</Link>;
  },
};

export const IconOnlyLoadingWithLabel: LinkStory = {
  args: {
    variant: 'primary',
    children: <MonoChevronRight />,
    isLoading: true,
    loadingLabel: 'Loading...',
  },
  render: (props: ILinkProps) => {
    return <Link {...props}>{props.children}</Link>;
  },
};

export const IconOnlyLoading: LinkStory = {
  args: {
    variant: 'primary',
    children: <MonoChevronRight />,
    isLoading: true,
    loadingLabel: '',
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
