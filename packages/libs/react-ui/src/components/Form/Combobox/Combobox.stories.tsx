import { MonoAccountCircle, MonoAdd } from '@kadena/react-icons/system';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { onLayer2, withContentWidth } from '../../../storyDecorators';
import { atoms } from '../../../styles';
import { getArrayOf } from '../../../utils';
import { Button } from '../../Button';
import { Box } from '../../Layout';
import { Form } from '../Form';
import type { IComboboxProps } from './Combobox';
import { Combobox, ComboboxItem } from './Combobox';

const meta: Meta<IComboboxProps> = {
  title: 'Form/Combobox',
  component: Combobox,
  decorators: [withContentWidth, onLayer2],
  parameters: {
    status: { type: 'Done' },
    docs: {
      description: {
        component:
          'Fully accessible combobox component. This component is built on top of [react-aria](https://react-spectrum.adobe.com/react-aria/index.html).',
      },
    },
  },
  argTypes: {
    description: {
      description: 'Helper text to display below the input.',
      control: {
        type: 'text',
      },
      table: {
        type: { summary: 'string' },
      },
    },
    info: {
      description: 'Additional information to display below the input.',
      control: {
        type: 'text',
      },
      table: {
        type: { summary: 'string' },
      },
    },
    label: {
      description: 'Label to display above the input.',
      control: {
        type: 'text',
      },
      table: {
        type: { summary: 'string' },
      },
    },

    placeholder: {
      description: 'Placeholder text to display in the input.',
      control: {
        type: 'text',
      },
      table: {
        type: { summary: 'string' },
      },
    },

    errorMessage: {
      description: 'Error message to display below the input.',
      control: {
        type: 'text',
      },
      table: {
        type: { summary: 'string' },
      },
    },
    isPositive: {
      description: 'Applies positive visual styling.',
      control: {
        type: 'boolean',
      },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    isInvalid: {
      description: 'Marks the input as invalid and applies visual styling.',
      control: {
        type: 'boolean',
      },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    isDisabled: {
      description: 'Disables the input and applies visual styling.',
      control: {
        type: 'boolean',
      },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    isRequired: {
      description: 'Marks the input as required',
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

export default meta;
type Story = StoryObj<IComboboxProps>;

export const Default: Story = {
  args: {
    isDisabled: false,
    isInvalid: false,
    isRequired: false,
    isPositive: false,
    description: 'Some description',
    label: 'Select something',
    placeholder: 'Select an option',
  },
  render: (args) => {
    return (
      <Combobox {...args}>
        <ComboboxItem key="option1">Option 1</ComboboxItem>
        <ComboboxItem key="option2">Option 2</ComboboxItem>
        <ComboboxItem key="option3">Option 3</ComboboxItem>
        <ComboboxItem key="option4">Option 4</ComboboxItem>
      </Combobox>
    );
  },
};

export const WithIcon: Story = {
  args: {
    isDisabled: false,
    isInvalid: false,
    isRequired: false,
    isPositive: false,
    description: 'Some description',
    label: 'Select something',
    placeholder: 'Select an option',
  },
  render: (args) => {
    return (
      <Combobox {...args} startVisual={<MonoAccountCircle />}>
        <ComboboxItem key="option1">Option 1</ComboboxItem>
        <ComboboxItem key="option2">Option 2</ComboboxItem>
        <ComboboxItem key="option3">Option 3</ComboboxItem>
        <ComboboxItem key="option4">Option 4</ComboboxItem>
      </Combobox>
    );
  },
};

export const ComplexItems = () => (
  <Combobox label="Select an option">
    <ComboboxItem key="option1" textValue="Option 1">
      <Box alignItems="center" gap="xs" display="flex">
        <MonoAccountCircle />
        Option 1
      </Box>
    </ComboboxItem>
    <ComboboxItem key="option2" textValue="Option 2">
      <Box alignItems="center" gap="xs" display="flex">
        <MonoAdd />
        Option 2
      </Box>
    </ComboboxItem>
  </Combobox>
);
export const ValidationError = () => (
  <Combobox label="Select an option" errorMessage="Error message" isInvalid>
    <ComboboxItem key="option1">Option 1</ComboboxItem>
    <ComboboxItem key="option2">Option 2</ComboboxItem>
    <ComboboxItem key="option3">Option 3</ComboboxItem>
    <ComboboxItem key="option4">Option 4</ComboboxItem>
  </Combobox>
);

export const Disabled = () => (
  <Combobox label="Select an option" isDisabled>
    <ComboboxItem key="option1">Option 1</ComboboxItem>
    <ComboboxItem key="option2">Option 2</ComboboxItem>
    <ComboboxItem key="option3">Option 3</ComboboxItem>
    <ComboboxItem key="option4">Option 4</ComboboxItem>
  </Combobox>
);

export const Dynamic = () => {
  const items = getArrayOf(
    (index) => ({
      label: `Option ${index}`,
      key: `option${index}`,
    }),
    100,
  );
  return (
    <Combobox label="Select an option" items={items}>
      {(item) => <ComboboxItem key={item.key}>{item.label}</ComboboxItem>}
    </Combobox>
  );
};

export const NativeValidation: Story = {
  name: 'Native validation',
  render: () => {
    const [selectedKey, setSelectedKey] = useState<string>();

    return (
      <Form
        className={atoms({
          display: 'flex',
          flexDirection: 'column',
          gap: 'md',
        })}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <p>
          Keep in mind that native validation is only triggered when the a form
          is submitted. for realtime validation use the them `isInvalid` prop.
        </p>
        <Combobox
          label="Select an option"
          isRequired
          validationBehavior="native"
          selectedKey={selectedKey}
          onSelectionChange={(e) => {
            setSelectedKey(e as string);
          }}
          placeholder="Required"
        >
          <ComboboxItem key="option1">Option 1</ComboboxItem>
          <ComboboxItem key="option2">Option 2</ComboboxItem>
          <ComboboxItem key="option3">Option 3</ComboboxItem>
          <ComboboxItem key="option4">Option 4</ComboboxItem>
        </Combobox>

        <Button type="submit">Submit</Button>
      </Form>
    );
  },
};
