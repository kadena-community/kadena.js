import type { ISelectFieldProps } from '@components/Form';
import { SelectField } from '@components/Form';
import { statusVariant } from '@components/Form/FormFieldWrapper/FormFieldWrapper.css';
import { SystemIcon } from '@components/Icon';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

type StoryProps = {
  startIcon: React.ReactElement;
} & ISelectFieldProps;

const meta: Meta<StoryProps> = {
  title: 'Form/SelectField',
  parameters: {
    status: { type: 'inDevelopment' },
    docs: {
      description: {
        component:
          'SelectField is the composition of the Select and FormFieldWrapper components to provide a select with a label, helper text, and other peripheral information.',
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
    startIcon: <SystemIcon.Account />,
  },
  render: ({ startIcon, disabled, status, tag, helperText, info, label }) => {
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
          startIcon,
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
