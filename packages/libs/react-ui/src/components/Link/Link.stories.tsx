import {
  MonoAdd,
  MonoChevronLeft,
  MonoChevronRight,
} from '@kadena/react-icons/system';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import React from 'react';
import { button } from '../Button/SharedButton.css';
import { Box } from '../Layout/Box/Box';
import { Heading } from '../Typography/Heading/Heading';
import type { ILinkProps } from './Link';
import { Link } from './Link';

// eslint-disable-next-line @kadena-dev/typedef-var
const buttonVariants = Object.keys(
  (button as any).classNames?.variants?.variant,
) as ILinkProps['variant'][];

// eslint-disable-next-line @kadena-dev/typedef-var
const buttonColors = Object.keys(
  (button as any).classNames?.variants?.color,
) as ILinkProps['color'][];

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
    variant: {
      options: buttonVariants,
      control: {
        type: 'select',
      },
      description: 'button style variant',
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
      description: 'button color variant',
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
  name: 'Link',
  args: {
    text: 'Click me',
    variant: 'text',
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
    return <Link {...props}>{text}</Link>;
  },
};

export const AllVariants: StoryFn<ILinkProps> = ({
  isCompact,
  isDisabled,
  isLoading,
}) => (
  <Box gap="xs" display="flex">
    <Box gap="xs" display="flex" flexDirection="column" alignItems="flex-start">
      <Heading variant="h6">Contained</Heading>
      {buttonColors.map((color) => (
        <Link
          key={color}
          color={color}
          isCompact={isCompact}
          isDisabled={isDisabled}
          isLoading={isLoading}
          href="#"
          variant="contained"
          startIcon={<MonoChevronLeft />}
          endIcon={<MonoChevronRight />}
        >
          {color}
        </Link>
      ))}
    </Box>

    <Box gap="xs" display="flex" flexDirection="column" alignItems="flex-start">
      <Heading variant="h6">Alternative</Heading>
      {buttonColors.map((color) => (
        <Link
          key={color}
          color={color}
          variant="alternative"
          isCompact={isCompact}
          href="#"
          isDisabled={isDisabled}
          isLoading={isLoading}
          startIcon={<MonoChevronLeft />}
          endIcon={<MonoChevronRight />}
        >
          {color}
        </Link>
      ))}
    </Box>

    <Box gap="xs" display="flex" flexDirection="column" alignItems="flex-start">
      <Heading variant="h6">Outlined</Heading>
      {buttonColors.map((color) => (
        <Link
          key={color}
          color={color}
          variant="outlined"
          href="#"
          isCompact={isCompact}
          isDisabled={isDisabled}
          isLoading={isLoading}
          startIcon={<MonoChevronLeft />}
          endIcon={<MonoChevronRight />}
        >
          {color}
        </Link>
      ))}
    </Box>

    <Box gap="xs" display="flex" flexDirection="column" alignItems="flex-start">
      <Heading variant="h6">Text (default)</Heading>
      {buttonColors.map((color) => (
        <Link
          key={color}
          color={color}
          variant="text"
          href="#"
          isCompact={isCompact}
          isDisabled={isDisabled}
          isLoading={isLoading}
          startIcon={<MonoChevronLeft />}
          endIcon={<MonoChevronRight />}
        >
          {color}
        </Link>
      ))}
    </Box>
  </Box>
);

export const StartIcon: StoryFn<ILinkProps> = ({
  isCompact,
  isDisabled,
  isLoading,
  color,
  variant,
}) => (
  <Link
    startIcon={<MonoAdd />}
    isCompact={isCompact}
    isDisabled={isDisabled}
    isLoading={isLoading}
    color={color}
    variant={variant}
  >
    Click me
  </Link>
);

export const EndIcon: StoryFn<ILinkProps> = ({
  isCompact,
  isDisabled,
  isLoading,
  color,
  variant,
}) => (
  <Link
    endIcon={<MonoAdd />}
    isCompact={isCompact}
    isDisabled={isDisabled}
    isLoading={isLoading}
    color={color}
    variant={variant}
  >
    Click me
  </Link>
);

export const OnlyIcon: StoryFn<ILinkProps> = ({
  isCompact,
  isDisabled,
  isLoading,
  color,
  variant,
}) => (
  <Link
    icon={<MonoAdd />}
    isCompact={isCompact}
    isDisabled={isDisabled}
    isLoading={isLoading}
    color={color}
    variant={variant}
  />
);

export default meta;
