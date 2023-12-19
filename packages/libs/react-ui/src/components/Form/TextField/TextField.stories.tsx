import type { ITextFieldProps } from '@components/Form';
import { TextField } from '@components/Form';
import { statusVariant } from '@components/Form/FormFieldWrapper/FormFieldWrapper.css';
import { SystemIcon } from '@components/Icon';
import { onBase, onLayer2, onLayer3, withContentWidth } from '@storyDecorators';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<ITextFieldProps> = {
  title: 'Form/TextField',
  component: TextField,
  decorators: [withContentWidth, onLayer2],
  parameters: {
    status: { type: 'inDevelopment' },
    docs: {
      description: {
        component:
          'TextField is the composition of Input and FormFieldWrapper to provide an input with a label, helper text, and other peripheral information.',
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
    startIcon: {
      description: 'Initial icon that can be passed as a prop.',
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
  },
};

type Story = StoryObj<ITextFieldProps>;

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
    startIcon: <SystemIcon.Account />,
    leadingText: 'Leading',
  },
  render: ({
    leadingText,
    startIcon,
    disabled,
    status,
    tag,
    helperText,
    info,
    label,
  }) => {
    return (
      <TextField
        tag={tag}
        info={info}
        label={label}
        status={status}
        disabled={disabled}
        helperText={helperText}
        id="inputStory"
        leadingText={leadingText}
        startIcon={startIcon}
        placeholder="This is a placeholder"
      />
    );
  },
};

export default meta;
