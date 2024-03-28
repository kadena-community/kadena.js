import { MonoChevronLeft, MonoChevronRight } from '@kadena/react-icons';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import React from 'react';

import { getVariants } from '../../storyDecorators/getVariants';
import { iconControl } from '../../storyDecorators/iconControl';
import { Box } from '../Layout/Box/Box';
import type { IButtonProps } from './Button';
import { Button } from './Button';
import { button } from './Button.css';

const variants = getVariants(button);

const meta: Meta<IButtonProps> = {
  title: 'Components/Button',
  parameters: {
    status: { type: 'releaseCandidate' },
    controls: {
      hideNoControlsWarning: true,
      sort: 'requiredFirst',
    },
    docs: {
      description: {
        component:
          'The Button component renders a button which will be styled according to the variant/color prop (`contained/primary` being the default)',
      },
    },
  },
  argTypes: {
    onPress: {
      action: 'clicked',
      description: 'callback when button is clicked',
      table: {
        disable: true,
      },
    },
    icon: iconControl,
    startIcon: iconControl,
    endIcon: iconControl,
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
      description: 'button style variant',
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
    avatarProps: {
      description:
        'Props for the avatar component which can be rendered instead of startIcon',
      control: {
        type: 'boolean',
      },
    },
  },
};

type ButtonStory = StoryObj<IButtonProps>;

export const _Button: ButtonStory = {
  args: {
    children: 'Hello world',
    variant: 'primary',
    onPress: () => undefined,
  },
  render: (props: IButtonProps) => {
    return <Button {...props}>{props.children}</Button>;
  },
};

export const StartIcon: ButtonStory = {
  args: {
    children: 'Hello world',
    variant: 'primary',
    startIcon: <MonoChevronLeft />,
    onPress: () => undefined,
  },
  render: (props: IButtonProps) => {
    return <Button {...props}>{props.children}</Button>;
  },
};

export const EndIcon: ButtonStory = {
  args: {
    children: 'Hello world',
    variant: 'primary',
    endIcon: <MonoChevronRight />,
    onPress: () => undefined,
  },
  render: (props: IButtonProps) => {
    return <Button {...props}>{props.children}</Button>;
  },
};

export const WithAvatar: ButtonStory = {
  args: {
    children: 'Hello world',
    variant: 'primary',
    avatarProps: {
      imageUrl: 'https://via.placeholder.com/150',
      status: 'info',
    },
    onPress: () => undefined,
  },
  render: (props: IButtonProps) => {
    return <Button {...props}>{props.children}</Button>;
  },
};

export const BadgeOnly: ButtonStory = {
  args: {
    children: 'Hello world',
    variant: 'primary',
    badgeValue: '6',
    onPress: () => undefined,
  },
  render: (props: IButtonProps) => {
    return <Button {...props}>{props.children}</Button>;
  },
};

export const BadgeAndEndIcon: ButtonStory = {
  args: {
    children: 'Hello world',
    variant: 'primary',
    endIcon: <MonoChevronRight />,
    badgeValue: '6',
    onPress: () => undefined,
  },
  render: (props: IButtonProps) => {
    return <Button {...props}>{props.children}</Button>;
  },
};

export const BadgeAndStartIcon: ButtonStory = {
  args: {
    children: 'Hello world',
    variant: 'primary',
    startIcon: <MonoChevronLeft />,
    badgeValue: '6',
    onPress: () => undefined,
  },
  render: (props: IButtonProps) => {
    return <Button {...props}>{props.children}</Button>;
  },
};

export const IconOnly: ButtonStory = {
  args: {
    variant: 'primary',
    icon: <MonoChevronRight />,
    onPress: () => undefined,
  },
  render: (props: IButtonProps) => {
    return <Button {...props}>{props.children}</Button>;
  },
};

export const AllVariants: StoryFn<IButtonProps> = ({
  variant,
  ...props
}: IButtonProps) => (
  <Box gap="xs" display="flex">
    <Box gap="md" display="flex" flexDirection="column" alignItems="center">
      {variants.variant.map((item) => (
        <Button key={item} variant={item as IButtonProps['variant']} {...props}>
          {props.children || item}
        </Button>
      ))}
    </Box>
  </Box>
);

export default meta;
