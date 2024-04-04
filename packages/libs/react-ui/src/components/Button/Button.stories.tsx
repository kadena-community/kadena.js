import {
  MonoAdd,
  MonoChevronLeft,
  MonoChevronRight,
} from '@kadena/react-icons/system';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Box } from '../Layout/Box/Box';
import { Heading, Text } from '../Typography';
import type { IButtonProps } from './Button';
import { Button } from './Button';
import { button } from './SharedButton.css';
import { ToggleButton } from './ToggleButton';

// eslint-disable-next-line @kadena-dev/typedef-var
const buttonVariants = Object.keys(
  (button as any).classNames?.variants?.variant,
) as IButtonProps['variant'][];

// eslint-disable-next-line @kadena-dev/typedef-var
const buttonColors = Object.keys(
  (button as any).classNames?.variants?.color,
) as IButtonProps['color'][];

const meta: Meta<IButtonProps> = {
  title: 'Components/Button',
  component: Button,
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

type ButtonStory = StoryObj<
  {
    text: string;
  } & IButtonProps
>;

export const _Button: ButtonStory = {
  name: 'Button',
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
  },
  render: ({ text, ...props }) => {
    return <Button {...props}>{text}</Button>;
  },
};

export const AllVariants: StoryFn<IButtonProps> = ({
  isCompact,
  isDisabled,
  isLoading,
}) => (
  <Box gap="xs" display="flex">
    <Box gap="xs" display="flex" flexDirection="column" alignItems="flex-start">
      <Heading variant="h6">Contained (default)</Heading>
      {buttonColors.map((color) => (
        <Button
          key={color}
          color={color}
          isCompact={isCompact}
          isDisabled={isDisabled}
          isLoading={isLoading}
          startIcon={<MonoChevronLeft />}
          endIcon={<MonoChevronRight />}
        >
          {color}
        </Button>
      ))}
    </Box>

    <Box gap="xs" display="flex" flexDirection="column" alignItems="flex-start">
      <Heading variant="h6">Alternative</Heading>
      {buttonColors.map((color) => (
        <Button
          key={color}
          color={color}
          variant="alternative"
          isCompact={isCompact}
          isDisabled={isDisabled}
          isLoading={isLoading}
          startIcon={<MonoChevronLeft />}
          endIcon={<MonoChevronRight />}
        >
          {color}
        </Button>
      ))}
    </Box>

    <Box gap="xs" display="flex" flexDirection="column" alignItems="flex-start">
      <Heading variant="h6">Outlined</Heading>
      {buttonColors.map((color) => (
        <Button
          key={color}
          color={color}
          variant="outlined"
          isCompact={isCompact}
          isDisabled={isDisabled}
          isLoading={isLoading}
          startIcon={<MonoChevronLeft />}
          endIcon={<MonoChevronRight />}
        >
          {color}
        </Button>
      ))}
    </Box>

    <Box gap="xs" display="flex" flexDirection="column" alignItems="flex-start">
      <Heading variant="h6">Text</Heading>
      {buttonColors.map((color) => (
        <Button
          key={color}
          color={color}
          variant="text"
          isCompact={isCompact}
          isDisabled={isDisabled}
          isLoading={isLoading}
          startIcon={<MonoChevronLeft />}
          endIcon={<MonoChevronRight />}
        >
          {color}
        </Button>
      ))}
    </Box>
  </Box>
);

export const StartIcon: StoryFn<IButtonProps> = ({
  isCompact,
  isDisabled,
  isLoading,
  color,
  variant,
}) => (
  <Button
    startIcon={<MonoAdd />}
    isCompact={isCompact}
    isDisabled={isDisabled}
    isLoading={isLoading}
    color={color}
    variant={variant}
  >
    Click me
  </Button>
);

export const EndIcon: StoryFn<IButtonProps> = ({
  isCompact,
  isDisabled,
  isLoading,
  color,
  variant,
}) => (
  <Button
    endIcon={<MonoAdd />}
    isCompact={isCompact}
    isDisabled={isDisabled}
    isLoading={isLoading}
    color={color}
    variant={variant}
  >
    Click me
  </Button>
);

export const OnlyIcon: StoryFn<IButtonProps> = ({
  isCompact,
  isDisabled,
  isLoading,
  color,
  variant,
}) => (
  <Button
    icon={<MonoAdd />}
    isCompact={isCompact}
    isDisabled={isDisabled}
    isLoading={isLoading}
    color={color}
    variant={variant}
  />
);

export const _ToggleButton = () => {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <Box gap="xs" display="flex" flexDirection="column" alignItems="flex-start">
      <Text>
        Toggle button is same as button button can stay selected (active) the
        styles are not final for now it is the same as button in addition to
        selected state which is same as active/focused state
      </Text>
      <ToggleButton
        variant="contained"
        color="primary"
        onChange={setIsSelected}
        isSelected={isSelected}
      >
        {isSelected ? 'Selected' : 'Not selected'}
      </ToggleButton>
    </Box>
  );
};

export default meta;
