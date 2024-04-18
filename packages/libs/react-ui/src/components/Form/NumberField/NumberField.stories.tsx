import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { onLayer2, withContentWidth } from '../../../storyDecorators';
import { atoms } from '../../../styles';
import { Button } from '../../Button';
import { NumberField } from './NumberField';

import { MonoAccountCircle } from '@kadena/react-icons/system';
import { Form } from '../Form';
import type { INumberFieldProps } from './NumberField';

const formStoryClass = atoms({
  display: 'flex',
  flexDirection: 'column',
  gap: 'md',
});

const meta: Meta<INumberFieldProps> = {
  title: 'Form/NumberField',
  component: NumberField,
  decorators: [withContentWidth, onLayer2],
  parameters: {
    status: { type: 'releaseCandidate' },
    docs: {
      description: {
        component:
          'The NumberField component is a wrapper around the native input (type number) element that provides the ability to add additional information.',
      },
    },
  },
  argTypes: {
    onChange: {
      description: 'onChange handler',
      control: {
        disable: true,
      },
      table: {
        disable: true,
      },
    },
    onValueChange: {
      description: 'onValueChange handler',
      control: {
        disable: true,
      },
      table: {
        disable: true,
      },
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
    inputFont: {
      description: 'Font to use for the input.',
      control: {
        type: 'select',
        options: ['body', 'code'],
      },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'body' },
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
    isReadOnly: {
      description: 'Prevents the input from being edited.',
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
    formatOptions: {
      description:
        'Allows you to specify the format of the number, such as style with "percent", "exceptZero" or currency with "EUR". Check [aria-number](https://react-spectrum.adobe.com/react-aria/useNumberField.html)',
    },
  },
};

export default meta;

type Story = StoryObj<INumberFieldProps>;

export const NumberFieldStory: Story = {
  name: 'NumberField',
  args: {
    isDisabled: false,
    tag: 'tag',
    description: 'This is helper text',
    info: '(optional)',
    label: 'Label',
    id: 'NumberFieldStory',
    placeholder: 'This is a placeholder',
    value: 8,
    isInvalid: false,
    isPositive: false,
    isReadOnly: false,
    isRequired: false,
    errorMessage: '',
    inputFont: 'body',
  },
  render: (props) => {
    const [value, setValue] = useState<number | undefined>();
    return (
      <NumberField
        {...props}
        value={value}
        onValueChange={setValue}
        formatOptions={{
          notation: 'standard',
          compactDisplay: 'long',
        }}
      />
    );
  },
};

export const WithoutLabel: Story = {
  name: 'Without label',
  render: () => {
    return <NumberField placeholder="placeholder" />;
  },
};

export const UsdFormat: Story = {
  name: 'USD format',
  render: () => {
    return (
      <NumberField
        label="Tell me your salary"
        placeholder="placeholder"
        formatOptions={{
          style: 'currency',
          currency: 'USD',
        }}
      />
    );
  },
};

export const WithStartAddon: Story = {
  name: 'With start addon',
  render: () => {
    const [value, setValue] = useState<number | undefined>();

    return (
      <Form
        className={formStoryClass}
        onSubmit={(e) => {
          e.preventDefault();
          alert(value);
        }}
      >
        <NumberField
          label="With addon"
          value={value}
          onValueChange={setValue}
          startAddon={<MonoAccountCircle />}
        />
        <Button type="submit">Submit</Button>
      </Form>
    );
  },
};

export const MinValue: Story = {
  name: 'Minimum value',
  render: () => {
    return (
      <Form
        className={formStoryClass}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <NumberField
          label="Min value 5"
          validationBehavior="aria"
          minValue={5}
        />
        <Button type="submit">Submit</Button>
      </Form>
    );
  },
};

export const CustomErrorMessage: Story = {
  name: 'Custom error message',
  render: () => {
    const [value, setValue] = useState<number>();
    return (
      <Form
        className={formStoryClass}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <NumberField
          label="Overiding native message"
          validationBehavior="native"
          isRequired
          errorMessage={(validation) => {
            if (validation.validationDetails.valueMissing) {
              return 'Custom message for required';
            }
          }}
        />

        <NumberField
          label="When was the first transaction in the KDA mainnet done?"
          description={
            value === 2019
              ? 'You are a true believer 🚀'
              : 'Dont randomly test 😒'
          }
          value={value}
          isPositive={value === 2019}
          onValueChange={setValue}
          validationBehavior="aria"
          isInvalid={!!value && value !== 2019}
          errorMessage={'WOOOPS'}
        />
        <Button type="submit">Submit</Button>
      </Form>
    );
  },
};
