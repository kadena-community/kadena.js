import type { IFormFieldWrapperProps } from '@components/Form';
import { FormFieldWrapper, Input } from '@components/Form';
import type { SystemIcon } from '@components/Icon';
import type { Meta, StoryObj } from '@storybook/react';
import { vars } from '@theme/vars.css';
import React from 'react';
import { statusVariant } from './FormFieldWrapper.css';

type StoryProps = {
  helperText: string;
  leadingText: string;
  icon: keyof typeof SystemIcon;
  rightIcon: keyof typeof SystemIcon;
} & IFormFieldWrapperProps;

const meta: Meta<StoryProps> = {
  title: 'Form/FormFieldWrapper',
  parameters: {
    docs: {
      description: {
        component:
          'The FormFieldWrapper component is intended to be used to wrap one or more form input components to provide them with a shared and optional label, tag, info, helper text and status colors.',
      },
    },
  },
  argTypes: {
    label: {
      description: 'Label for the input.',
      control: {
        type: 'text',
      },
    },
    leadingTextWidth: {
      description:
        'Width of the leading text of all inputs inside. Each of the inputs will default to the length of their leading text when this is not set.',
      control: {
        type: 'select',
      },
      options: [
        undefined,
        ...Object.keys(vars.sizes).map((key) => key as keyof typeof vars.sizes),
      ],
    },
    tag: {
      description: 'Tag that is rendered next to the label',
      control: {
        type: 'text',
      },
    },
    info: {
      description: 'Text that is rendered on the top right with an info icon',
      control: {
        type: 'text',
      },
    },
    helperText: {
      description:
        'Text that is rendered below the input to give the user additional information. Often will be used for validation messages.',
      control: {
        type: 'text',
      },
    },
    status: {
      description:
        'This determines the color of the helper text and input border. It can be used to indicate an error.',
      options: [
        undefined,
        ...(Object.keys(statusVariant) as (keyof typeof statusVariant)[]),
      ],
      control: {
        type: 'select',
      },
    },
    disabled: {
      description: 'Disables the input and applies visual styling.',
      control: {
        type: 'boolean',
      },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

type Story = StoryObj<StoryProps>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/react/api/csf
 * to learn how to use render functions.
 */

export const Group: Story = {
  name: 'Input Group',
  args: {
    tag: 'tag',
    helperText: 'This is helper text',
    info: '(optional)',
    label: 'Label',
    leadingTextWidth: undefined,
    disabled: false,
    status: undefined,
  },
  render: ({
    disabled,
    status,
    tag,
    helperText,
    info,
    label,
    leadingTextWidth,
  }) => {
    return (
      <FormFieldWrapper
        tag={tag}
        info={info}
        label={label}
        leadingTextWidth={leadingTextWidth}
        status={status}
        disabled={disabled}
        helperText={helperText}
        htmlFor="inputStory"
      >
        <Input
          id="inputStory"
          placeholder="Input 1"
          disabled={disabled}
          leadingText="Leading"
        />
        <Input
          id="inputStory2"
          placeholder="Input 2"
          disabled={disabled}
          leadingText="Leading 2"
        />
      </FormFieldWrapper>
    );
  },
};

export default meta;
