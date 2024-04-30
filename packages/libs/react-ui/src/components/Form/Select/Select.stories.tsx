import { MonoAccountCircle, MonoAdd } from '@kadena/react-icons/system';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import {
  getVariants,
  onLayer3,
  withContentWidth,
} from '../../../storyDecorators';
import { atoms } from '../../../styles';
import { getArrayOf } from '../../../utils';
import { Button } from '../../Button';
import { Box } from '../../Layout';
import { Form } from '../Form';
import { input } from '../Form.css';
import type { ISelectProps } from './Select';
import { Select, SelectItem } from './Select';

const { size, variant, fontType } = getVariants(input);

const meta: Meta<ISelectProps> = {
  title: 'Form/Select',
  component: Select,
  decorators: [withContentWidth, onLayer3],
  parameters: {
    status: { type: 'releaseCandidate' },
    docs: {
      description: {
        component:
          'Fully accessible select component. This component is built on top of [react-aria](https://react-spectrum.adobe.com/react-aria/index.html).',
      },
    },
  },
  argTypes: {
    variant: {
      description: 'Variant of the input.',
      control: {
        type: 'select',
      },
      options: variant,
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      description: 'Size of the input.',
      control: {
        type: 'radio',
      },
      options: size,
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
      },
    },
    fontType: {
      description: 'Font type of the input.',
      control: { type: 'radio' },
      options: fontType,
      table: { type: { summary: 'string' }, defaultValue: { summary: 'ui' } },
    },
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
type Story = StoryObj<ISelectProps>;

export const Default: Story = {
  render: (args) => {
    return (
      <Select {...args}>
        <SelectItem key="option1">Option 1</SelectItem>
        <SelectItem key="option2">Option 2</SelectItem>
        <SelectItem key="option3">Option 3</SelectItem>
        <SelectItem key="option4">Option 4</SelectItem>
      </Select>
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
      <Select {...args} startVisual={<MonoAccountCircle />}>
        <SelectItem key="option1">Option 1</SelectItem>
        <SelectItem key="option2">Option 2</SelectItem>
        <SelectItem key="option3">Option 3</SelectItem>
        <SelectItem key="option4">Option 4</SelectItem>
      </Select>
    );
  },
};

export const ComplexItems = () => (
  <Select label="Select an option">
    <SelectItem key="option1" textValue="Option 1">
      <Box alignItems="center" gap="xs" display="flex">
        <MonoAccountCircle />
        Option 1
      </Box>
    </SelectItem>
    <SelectItem key="option2" textValue="Option 2">
      <Box alignItems="center" gap="xs" display="flex">
        <MonoAdd />
        Option 2
      </Box>
    </SelectItem>
  </Select>
);
export const ValidationError = () => (
  <Select label="Select an option" errorMessage="Error message" isInvalid>
    <SelectItem key="option1">Option 1</SelectItem>
    <SelectItem key="option2">Option 2</SelectItem>
    <SelectItem key="option3">Option 3</SelectItem>
    <SelectItem key="option4">Option 4</SelectItem>
  </Select>
);

export const Disabled = () => (
  <Select label="Select an option" isDisabled>
    <SelectItem key="option1">Option 1</SelectItem>
    <SelectItem key="option2">Option 2</SelectItem>
    <SelectItem key="option3">Option 3</SelectItem>
    <SelectItem key="option4">Option 4</SelectItem>
  </Select>
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
    <Select label="Select an option" items={items}>
      {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
    </Select>
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
          is submitted. for realtime validation use the `isInvalid` prop.
        </p>
        <Select
          label="Select an option"
          isRequired
          validationBehavior="native"
          selectedKey={selectedKey}
          onSelectionChange={(e) => {
            setSelectedKey(e as string);
          }}
          placeholder="Required"
        >
          <SelectItem key="option1">Option 1</SelectItem>
          <SelectItem key="option2">Option 2</SelectItem>
          <SelectItem key="option3">Option 3</SelectItem>
          <SelectItem key="option4">Option 4</SelectItem>
        </Select>

        <Button type="submit">Submit</Button>
      </Form>
    );
  },
};

export const WithAddons = () => {
  const items = getArrayOf(
    (index) => ({
      label: `Option ${index}`,
      key: `option${index}`,
    }),
    100,
  );
  return (
    <Select label="Select an option" items={items} startVisual={<MonoAdd />}>
      {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
    </Select>
  );
};
