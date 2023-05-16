import { Button, IButtonProps } from './Button';
import { colorVariants } from './Button.css';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// TODO: Add icon support
const meta: Meta<
  {
    // selectIcon: keyof typeof SystemIcons;
    text: string;
  } & IButtonProps
> = {
  title: 'Button',
  component: Button,
  argTypes: {
    onClick: { action: 'clicked' },
    // selectIcon: {
    //   options: Object.keys(SystemIcons) as (keyof typeof SystemIcons)[],
    //   control: {
    //     type: 'select',
    //   },
    // },
    color: {
      options: Object.keys(colorVariants) as (keyof typeof colorVariants)[],
      control: {
        type: 'select',
      },
    },
    title: {
      control: {
        type: 'text',
      },
    },
    text: {
      control: {
        type: 'text',
      },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
    },
  },
};

export default meta;
type Story = StoryObj<
  {
    text: string;
    // selectIcon: keyof typeof SystemIcons;
  } & IButtonProps
>;

export const Dynamic: Story = {
  name: 'Button',
  args: {
    // selectIcon: undefined,
    title: 'test title',
    disabled: false,
    text: 'Click me',
    color: undefined,
  },
  render: ({ onClick, title, disabled, text, color }) => {
    return (
      <>
        <Button
          title={title}
          onClick={onClick}
          disabled={disabled}
          color={color}
        >
          {text}
        </Button>
      </>
    );
  },
};

export const Primary: Story = {
  args: {
    title: 'Primary Filled',
    disabled: false,
    children: 'Primary Filled',
    color: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    title: 'Secondary Filled',
    disabled: false,
    children: 'Secondary Filled',
    color: 'secondary',
  },
};

export const Positive: Story = {
  args: {
    title: 'Positive Filled',
    disabled: false,
    children: 'Positive Filled',
    color: 'positive',
  },
};

export const Negative: Story = {
  args: {
    title: 'Negative Filled',
    disabled: false,
    children: 'Negative Filled',
    color: 'negative',
  },
};

export const Warning: Story = {
  args: {
    title: 'Warning Filled',
    disabled: false,
    children: 'Warning Filled',
    color: 'warning',
  },
};
