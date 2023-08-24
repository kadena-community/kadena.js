import { SystemIcon } from '@components/Icon';
import { statusVariant } from '@components/InputWrapper/InputWrapper.css';
import { ITextFieldProps, TextField } from '@components/TextField';
import type { Meta, StoryObj } from '@storybook/react';
import { vars } from '@theme/vars.css';
import React from 'react';

type StoryProps = {
  helperText: string;
  leadingText: string;
  leftIcon: keyof typeof SystemIcon;
  rightIcon: keyof typeof SystemIcon;
} & ITextFieldProps;

const meta: Meta<StoryProps> = {
  title: 'Components/TextField',
  parameters: {
    docs: {
      description: {
        component:
          'TextField is the composition of Input and InputWrapper to provide an input with a label, helper text, and other peripheral information.',
      },
    },
  },
  argTypes: {
    label: {
      description: 'Label for the input',
      control: {
        type: 'text',
      },
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
    leadingText: {
      description: "Leading text that is rendered inside the input's border.",
      control: {
        type: 'text',
      },
    },
    leadingTextWidth: {
      description:
        'Width of the leading text. Defaults to the size of the text itself.',
      control: {
        type: 'select',
      },
      options: [
        undefined,
        ...Object.keys(vars.sizes).map((key) => key as keyof typeof vars.sizes),
      ],
    },
    status: {
      options: [
        undefined,
        ...(Object.keys(statusVariant) as (keyof typeof statusVariant)[]),
      ],
      description:
        'This determines the color of the helper text and input border. It can be used to indicate an error.',
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
    leftIcon: {
      description:
        'Icon rendered inside the input to the left of the input text.',
      options: Object.keys(SystemIcon) as (keyof typeof SystemIcon)[],
      control: {
        type: 'select',
      },
    },
    rightIcon: {
      description:
        'Icon rendered inside the input to the right of the input text.',
      options: Object.keys(SystemIcon) as (keyof typeof SystemIcon)[],
      control: {
        type: 'select',
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
  name: 'Text Field',
  args: {
    tag: 'tag',
    helperText: 'This is helper text',
    info: '(optional)',
    label: 'Label',
    disabled: false,
    status: undefined,
    leftIcon: 'Account',
    rightIcon: undefined,
    leadingText: 'Leading',
    leadingTextWidth: undefined,
  },
  render: ({
    leadingText,
    leftIcon,
    rightIcon,
    disabled,
    status,
    tag,
    helperText,
    info,
    label,
    leadingTextWidth,
  }) => {
    return (
      <TextField
        tag={tag}
        info={info}
        label={label}
        status={status}
        disabled={disabled}
        helperText={helperText}
        leadingTextWidth={leadingTextWidth}
        inputProps={{
          id: 'inputStory',
          leadingText,
          leftIcon: SystemIcon[leftIcon],
          rightIcon: SystemIcon[rightIcon],
          placeholder: 'This is a placeholder',
        }}
      />
    );
  },
};

export default meta;
