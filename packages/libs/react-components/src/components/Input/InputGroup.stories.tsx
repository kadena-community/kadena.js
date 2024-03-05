import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Input } from '.';
import type { SystemIcons } from './../../';
import type { IInputGroupProps } from './InputGroup';
import { InputGroup } from './InputGroup';

const meta: Meta<
  {
    rightPanelIcon: keyof typeof SystemIcons;
    leftPanelIcon: keyof typeof SystemIcons;
    leadingText: string;
  } & IInputGroupProps
> = {
  title: 'Input Group',
  argTypes: {
    label: {
      control: {
        type: 'text',
      },
    },
    tag: {
      control: {
        type: 'text',
      },
    },
    info: {
      control: {
        type: 'text',
      },
    },
    helper: {
      control: {
        type: 'text',
      },
    },
    status: {
      options: ['success', 'error'],
      control: {
        type: 'select',
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
    tag: string;
    helper: string;
    info: string;
    label: string;
  } & IInputGroupProps
>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/react/api/csf
 * to learn how to use render functions.
 */

export const Primary: Story = {
  name: 'Input Group',
  args: {
    tag: 'tag',
    helper: 'This is helper text',
    info: '(optional)',
    label: 'Label',
    disabled: false,
    status: undefined,
  },
  render: ({ tag, helper, info, label, disabled, status }) => {
    return (
      <>
        <InputGroup
          tag={tag}
          helper={helper}
          info={info}
          label={label}
          status={status}
          disabled={disabled}
        >
          <Input
            leadingText="Leading"
            placeholder={'This is a placeholder'}
            disabled={disabled}
            status={status}
          />
          <Input
            leadingText="Leading"
            placeholder={'This is a placeholder'}
            disabled={disabled}
            status={status}
          />
        </InputGroup>
      </>
    );
  },
};
