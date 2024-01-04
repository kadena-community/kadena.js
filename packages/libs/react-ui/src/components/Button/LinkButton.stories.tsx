import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import React from 'react';
import { LeadingIcon, Plus, TrailingIcon } from '../Icon/System/SystemIcon';
import { Box } from '../Layout/Box/Box';
import { Heading } from '../Typography/Heading/Heading';
import type { ILinkButtonProps } from './LinkButton';
import { LinkButton } from './LinkButton';
import { button } from './SharedButton.css';

// eslint-disable-next-line @kadena-dev/typedef-var
const buttonVariants = Object.keys(
  (button as any).classNames?.variants?.variant,
) as ILinkButtonProps['variant'][];

// eslint-disable-next-line @kadena-dev/typedef-var
const buttonColors = Object.keys(
  (button as any).classNames?.variants?.color,
) as ILinkButtonProps['color'][];

const meta: Meta<ILinkButtonProps> = {
  title: 'Components/LinkButton',
  component: LinkButton,
  parameters: {
    status: { type: 'inDevelopment' },
    controls: {
      hideNoControlsWarning: true,
      sort: 'requiredFirst',
    },
    docs: {
      description: {
        component:
          'The Button component renders a anchor tag (a) which will be styled according to the variant prop (`primary` being the default)',
      },
    },
  },
  argTypes: {
    href: {
      description: 'link target',
      table: {
        type: { summary: 'string' },
      },
    },
    variant: {
      options: buttonVariants,
      control: {
        type: 'select',
      },
      description: 'link button style variant',
      table: {
        type: { summary: buttonVariants.join(' | ') },
        defaultValue: { summary: 'default' },
      },
    },
    color: {
      options: buttonColors,
      control: {
        type: 'select',
      },
      description: 'link button color variant',
      table: {
        type: { summary: buttonColors.join(' | ') },
        defaultValue: { summary: 'default' },
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
      description: 'compact link button style',
      control: {
        type: 'boolean',
      },
    },
  },
};

type Story = StoryObj<
  {
    text: string;
  } & ILinkButtonProps
>;

export const Default: Story = {
  name: 'LinkButton',
  args: {
    text: 'Click me',
    variant: 'contained',
    color: 'primary',
    isDisabled: false,
    isCompact: false,
    isLoading: false,
    icon: undefined,
    startIcon: undefined,
    endIcon: undefined,
    href: '#',
  },
  render: ({ text, ...props }) => {
    return <LinkButton {...props}>{text}</LinkButton>;
  },
};

export const AllVariants: StoryFn<ILinkButtonProps> = ({
  isCompact,
  isDisabled,
  isLoading,
  href,
}) => (
  <Box gap="$2" display="flex">
    <Box gap="$2" display="flex" flexDirection="column" alignItems="flex-start">
      <Heading variant="h6">Default</Heading>
      {buttonColors.map((color) => (
        <LinkButton
          key={color}
          color={color}
          isCompact={isCompact}
          isDisabled={isDisabled}
          isLoading={isLoading}
          href={href}
          startIcon={<LeadingIcon />}
          endIcon={<TrailingIcon />}
        >
          {color}
        </LinkButton>
      ))}
    </Box>

    <Box gap="$2" display="flex" flexDirection="column" alignItems="flex-start">
      <Heading variant="h6">Alternative</Heading>
      {buttonColors.map((color) => (
        <LinkButton
          key={color}
          color={color}
          variant="alternative"
          isCompact={isCompact}
          isDisabled={isDisabled}
          isLoading={isLoading}
          href={href}
          startIcon={<LeadingIcon />}
          endIcon={<TrailingIcon />}
        >
          {color}
        </LinkButton>
      ))}
    </Box>

    <Box gap="$2" display="flex" flexDirection="column" alignItems="flex-start">
      <Heading variant="h6">Outlined</Heading>
      {buttonColors.map((color) => (
        <LinkButton
          key={color}
          color={color}
          variant="outlined"
          isCompact={isCompact}
          isDisabled={isDisabled}
          isLoading={isLoading}
          href={href}
          startIcon={<LeadingIcon />}
          endIcon={<TrailingIcon />}
        >
          {color}
        </LinkButton>
      ))}
    </Box>

    <Box gap="$2" display="flex" flexDirection="column" alignItems="flex-start">
      <Heading variant="h6">Text</Heading>
      {buttonColors.map((color) => (
        <LinkButton
          key={color}
          color={color}
          variant="text"
          isCompact={isCompact}
          isDisabled={isDisabled}
          isLoading={isLoading}
          href={href}
          startIcon={<LeadingIcon />}
          endIcon={<TrailingIcon />}
        >
          {color}
        </LinkButton>
      ))}
    </Box>
  </Box>
);

export const StartIcon: StoryFn<ILinkButtonProps> = ({
  isCompact,
  isDisabled,
  isLoading,
  color,
  variant,
  href,
}) => (
  <LinkButton
    startIcon={<Plus />}
    isCompact={isCompact}
    isDisabled={isDisabled}
    isLoading={isLoading}
    color={color}
    href={href}
    variant={variant}
  >
    Click me
  </LinkButton>
);

export const EndIcon: StoryFn<ILinkButtonProps> = ({
  isCompact,
  isDisabled,
  isLoading,
  color,
  variant,
  href,
}) => (
  <LinkButton
    endIcon={<Plus />}
    isCompact={isCompact}
    isDisabled={isDisabled}
    isLoading={isLoading}
    color={color}
    variant={variant}
    href={href}
  >
    Click me
  </LinkButton>
);

export const OnlyIcon: StoryFn<ILinkButtonProps> = ({
  isCompact,
  isDisabled,
  isLoading,
  color,
  variant,
  href,
}) => (
  <LinkButton
    icon={<Plus />}
    isCompact={isCompact}
    isDisabled={isDisabled}
    isLoading={isLoading}
    color={color}
    variant={variant}
    href={href}
  />
);

export default meta;
