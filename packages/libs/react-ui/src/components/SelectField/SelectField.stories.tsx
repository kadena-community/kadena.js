import { SystemIcon } from '@components/Icon';
import { statusVariant } from '@components/InputWrapper/InputWrapper.css';
import type { ISelectFieldProps } from '@components/SelectField';
import { SelectField } from '@components/SelectField';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

type StoryProps = {
  icon: keyof typeof SystemIcon;
} & ISelectFieldProps;

const meta: Meta<StoryProps> = {
  title: 'Components/SelectField',
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
    icon: {
      description: 'Icon rendered inside the select to the left of the text.',
      options: Object.keys(SystemIcon) as (keyof typeof SystemIcon)[],
      control: {
        type: 'select',
      },
    },
  },
};

type Story = StoryObj<StoryProps>;

export const Group: Story = {
  name: 'Select Field',
  args: {
    tag: 'tag',
    helperText: 'This is helper text',
    info: '(optional)',
    label: 'Label',
    disabled: false,
    status: undefined,
    icon: 'Account',
  },
  render: ({ icon, disabled, status, tag, helperText, info, label }) => {
    return (
      <SelectField
        tag={tag}
        info={info}
        label={label}
        status={status}
        disabled={disabled}
        helperText={helperText}
        selectProps={{
          ariaLabel: 'Select Story',
          id: 'inputStory',
          icon,
          placeholder: 'This is a placeholder',
        }}
      >
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </SelectField>
    );
  },
};

export default meta;
