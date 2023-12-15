import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import React from 'react';
import { Plus } from '../Icon/System/SystemIcon';
import type { IButtonProps } from './NewButton';
import { Button } from './NewButton';
import { button } from './NewButton.css';

// eslint-disable-next-line @kadena-dev/typedef-var
const buttonVariants = Object.keys(
  (button as any).classNames?.variants?.variant,
) as IButtonProps['variant'][];

const meta: Meta<IButtonProps> = {
  title: 'Components/NewButton',
  component: Button,
  parameters: {
    status: { type: 'inDevelopment' },
    controls: {
      hideNoControlsWarning: true,
      sort: 'requiredFirst',
    },
    docs: {
      description: {
        component:
          'The Button component renders a button which will be styled according to the variant prop (`primary` being the default)',
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
    type: {
      description: 'type of button',
      options: ['button', 'submit', 'reset'] as IButtonProps['type'][],
      control: {
        type: 'select',
      },
      table: {
        type: { summary: 'button | submit | reset' },
        defaultValue: { summary: 'button' },
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
    isOutlined: {
      description: 'outlined button style',
      control: {
        type: 'boolean',
      },
    },
  },
};

type Story = StoryObj<
  {
    text: string;
  } & IButtonProps
>;

export const Default: Story = {
  name: 'Button',
  args: {
    isDisabled: false,
    isCompact: false,
    isOutlined: false,
    icon: undefined,
    startIcon: undefined,
    endIcon: undefined,
    isLoading: false,
    text: 'Click me',
    variant: 'primary',
  },
  render: ({
    startIcon,
    endIcon,
    icon,
    isCompact,
    isDisabled,
    isOutlined,
    isLoading,
    onClick,
    text,
    variant = 'primary',
  }) => {
    return (
      <Button
        startIcon={startIcon}
        endIcon={endIcon}
        icon={icon}
        isCompact={isCompact}
        isDisabled={isDisabled}
        isOutlined={isOutlined}
        isLoading={isLoading}
        onClick={onClick}
        variant={variant}
      >
        {text}
      </Button>
    );
  },
};

export const StartIcon: StoryFn<IButtonProps> = () => (
  <Button startIcon={<Plus />}>Click me</Button>
);

export const EndIcon: StoryFn<IButtonProps> = () => (
  <Button endIcon={<Plus />}>Click me</Button>
);

export const OnlyIcon: StoryFn<IButtonProps> = () => <Button icon={<Plus />} />;

export default meta;
