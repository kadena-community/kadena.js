import { SystemIcons } from './../../';
import { type StyledButtonVariants } from './styles';
import { type IButtonProps, Button } from '.';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<
  {
    selectIcon: keyof typeof SystemIcons;
    selectVariant: StyledButtonVariants;
    text: string;
  } & IButtonProps
> = {
  title: 'Button',
  argTypes: {
    onClick: { action: 'clicked' },
    selectIcon: {
      options: Object.keys(SystemIcons) as (keyof typeof SystemIcons)[],
      control: {
        type: 'select',
      },
    },
    selectVariant: {
      options: ['primaryFilled', 'secondaryFilled', 'positiveFilled'],
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
    selectIcon: keyof typeof SystemIcons;
    selectVariant: StyledButtonVariants;
  } & IButtonProps
>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/react/api/csf
 * to learn how to use render functions.
 */

export const Primary: Story = {
  name: 'Button',
  args: {
    selectIcon: undefined,
    selectVariant: undefined,
    title: 'test title',
    disabled: false,
    text: 'Click me',
  },
  render: ({ selectIcon, onClick, title, disabled, text }) => {
    const Icon = SystemIcons[selectIcon];
    return (
      <>
        <Button title={title} onClick={onClick} icon={Icon} disabled={disabled}>
          {text}
        </Button>
      </>
    );
  },
};
