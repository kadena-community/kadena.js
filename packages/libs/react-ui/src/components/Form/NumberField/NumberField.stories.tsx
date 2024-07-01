import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import {
  getVariants,
  iconControl,
  onLayer2,
  withContentWidth,
} from '../../../storyDecorators';
import { atoms } from '../../../styles';
import { Button } from '../../Button';
import { NumberField } from './NumberField';

import { MonoAccountCircle } from '@kadena/react-icons/system';
import { Form } from '../Form';
import { input } from '../Form.css';
import type { INumberFieldProps } from './NumberField';
import { smallInputWrapper } from './NumberField.css';

const { variant, fontType, size } = getVariants(input);

const formStoryClass = atoms({
  display: 'flex',
  flexDirection: 'column',
  gap: 'md',
});

const formStorySmallInputsClass = atoms({
  display: 'flex',
  flexDirection: 'row',
  gap: 'md',
  maxWidth: 'content.maxWidth',
  backgroundColor: 'accent.primary.default',
});

const meta: Meta<INumberFieldProps> = {
  title: 'Form/NumberField',
  component: NumberField,
  decorators: [withContentWidth, onLayer2],
  parameters: {
    status: { type: 'stable' },
    docs: {
      description: {
        component:
          'The NumberField component is a wrapper around the native input (type number) element that provides the ability to add additional information.',
      },
    },
  },
  argTypes: {
    startVisual: iconControl,
    fontType: {
      control: {
        type: 'radio',
      },
      options: fontType,
      defaultValue: 'ui',
    },
    size: {
      control: {
        type: 'radio',
      },
      options: size,
      defaultValue: 'md',
    },
    variant: {
      control: {
        type: 'select',
      },
      options: variant,
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
    tag: {
      description: 'Tag to display below the input.',
      control: {
        type: 'text',
      },
      defaultValue: 'tag',
      table: {
        type: { summary: 'string' },
      },
    },
    label: {
      description: 'Label to display above the input.',
      control: {
        type: 'text',
      },
      defaultValue: 'Label',
      table: {
        type: { summary: 'string' },
      },
    },
    placeholder: {
      description: 'Placeholder text to display in the input.',
      control: {
        type: 'text',
      },
      defaultValue: 'This is a placeholder',
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
    isDisabled: {
      description: 'Disables the input and applies visual styling.',
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    isRequired: {
      description: 'Marks the input as required',
      control: {
        type: 'boolean',
      },
      defaultValue: false,
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
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
    direction: {
      description: 'Orientation of the form header labels',
      control: {
        type: 'radio',
      },
      options: {
        Row: 'row',
        Column: 'column',
      },
      defaultValue: 'row',
    },
  },
  args: {
    fontType: 'ui',
    size: 'md',
    variant: 'default',
    description: 'Helper text',
    info: 'Additional information',
    tag: 'tag',
    label: 'Label',
    placeholder: 'This is a placeholder',
    errorMessage: undefined,
    isDisabled: false,
    isRequired: false,
    direction: 'row',
  },
};

export default meta;

type Story = StoryObj<INumberFieldProps>;

export const NumberFieldStory: Story = {
  name: 'NumberField',
  args: {
    value: 8,
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
          startVisual={<MonoAccountCircle />}
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

export const SmallWidth: Story = {
  name: 'Small Width',
  args: {
    direction: 'column',
    placeholder: '0',
    label: 'Small Value',
  },
  render: (props) => {
    return (
      <div className={smallInputWrapper}>
        <Form
          className={formStorySmallInputsClass}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <NumberField
            {...props}
            label={`${props.label} 1`}
            validationBehavior="aria"
            minValue={0}
          />
          <NumberField
            {...props}
            label={`${props.label} 2`}
            validationBehavior="aria"
            minValue={0}
          />
        </Form>
      </div>
    );
  },
};
