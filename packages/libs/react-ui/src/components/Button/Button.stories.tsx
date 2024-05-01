import { MonoChevronLeft, MonoChevronRight } from '@kadena/react-icons';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import React from 'react';

import { Avatar, Badge } from '..';
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
    status: { type: 'Done' },
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
    loadingLabel: {
      description: 'label to be shown when loading',
      control: {
        type: 'text',
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
    startVisual: <MonoChevronLeft />,
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
    endVisual: <MonoChevronRight />,
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
    onPress: () => undefined,
    startVisual: <Avatar name="Robin Mulder" color="category3" />,
  },
  render: (props: IButtonProps) => {
    return <Button {...props}>{props.children}</Button>;
  },
};

export const BadgeOnly: ButtonStory = {
  args: {
    children: 'Hello world',
    variant: 'primary',
    onPress: () => undefined,
    endVisual: (
      <Badge size="sm" style="inverse">
        6
      </Badge>
    ),
  },
  render: (props: IButtonProps) => {
    return <Button {...props}>{props.children}</Button>;
  },
};

export const BadgeAndEndIcon: ButtonStory = {
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
    startVisual: <MonoChevronLeft />,
    endVisual: (
      <Badge size="sm" style="inverse">
        6
      </Badge>
    ),
    onPress: () => undefined,
  },
  render: (props: IButtonProps) => {
    return <Button {...props}>{props.children}</Button>;
  },
};

export const IconOnly: ButtonStory = {
  args: {
    variant: 'primary',
    children: <MonoChevronRight />,
    onPress: () => undefined,
  },
  render: (props: IButtonProps) => {
    return <Button {...props}>{props.children}</Button>;
  },
};

export const StartVisualLoading: ButtonStory = {
  args: {
    variant: 'primary',
    startVisual: <MonoChevronRight />,
    children: 'Hello world',
    isLoading: true,
    onPress: () => undefined,
  },
  render: (props: IButtonProps) => {
    return <Button {...props}>{props.children}</Button>;
  },
};

export const EndVisualLoading: ButtonStory = {
  args: {
    variant: 'primary',
    endVisual: <MonoChevronRight />,
    children: 'Hello world',
    isLoading: true,
    onPress: () => undefined,
  },
  render: (props: IButtonProps) => {
    return <Button {...props}>{props.children}</Button>;
  },
};

export const IconOnlyLoadingWithLabel: ButtonStory = {
  args: {
    variant: 'primary',
    children: <MonoChevronRight />,
    isLoading: true,
    loadingLabel: 'Loading...',
    onPress: () => undefined,
  },
  render: (props: IButtonProps) => {
    return <Button {...props}>{props.children}</Button>;
  },
};

export const IconOnlyLoading: ButtonStory = {
  args: {
    variant: 'primary',
    children: <MonoChevronRight />,
    isLoading: true,
    loadingLabel: '',
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
