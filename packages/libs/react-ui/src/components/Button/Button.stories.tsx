import { SystemIcon } from '../Icons';

import { colorVariants } from './Button.css';
import { Button, IButtonProps } from '.';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<
  {
    selectIcon: keyof typeof SystemIcon;
    text: string;
  } & IButtonProps
> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    onClick: { action: 'clicked' },
    selectIcon: {
      options: Object.keys(SystemIcon) as (keyof typeof SystemIcon)[],
      control: {
        type: 'select',
      },
    },
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
    selectIcon: keyof typeof SystemIcon;
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

export const ButtonIcon: Story = {
  name: 'Button with Icon',
  args: {
    selectIcon: 'Account',
    title: 'test title',
    disabled: false,
    text: 'Click me',
    color: undefined,
  },
  render: ({ onClick, title, disabled, text, color, selectIcon }) => {
    const Icon = SystemIcon[selectIcon];
    return (
      <>
        <Button
          title={title}
          onClick={onClick}
          disabled={disabled}
          color={color}
        >
          <Button.Icon icon={Icon} />
          {text}
        </Button>

        <Button
          title={title}
          onClick={onClick}
          disabled={disabled}
          color={color}
          style={{ marginTop: '10px' }}
        >
          {text}
          <Button.Icon icon={Icon} />
        </Button>
      </>
    );
  },
};
