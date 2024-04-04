import { MonoAccountCircle, MonoAdd } from '@kadena/react-icons/system';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { onLayer2, withContentWidth } from '../../../storyDecorators';
import { atoms } from '../../../styles';
import { Button } from '../../Button';
import { Text } from '../../Typography/Text/Text';
import { CopyButton } from '../ActionButtons/CopyButton';
import { Form } from '../Form';
import { TextField } from '../TextField';
import type { ITextFieldProps } from './TextField';

const formStoryClass = atoms({
  display: 'flex',
  flexDirection: 'column',
  gap: 'md',
});

const meta: Meta<ITextFieldProps> = {
  title: 'Form/TextField',
  component: TextField,
  decorators: [withContentWidth, onLayer2],
  parameters: {
    status: { type: 'releaseCandidate' },
    docs: {
      description: {
        component:
          'The TextField component is a wrapper around the native input element that provides the ability to add additional information.',
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
  },
};

export default meta;

type Story = StoryObj<ITextFieldProps>;

export const TextFieldStory: Story = {
  name: 'TextField',
  args: {
    isDisabled: false,
    tag: 'tag',
    description: 'This is helper text',
    info: '(optional)',
    label: 'Label',
    id: 'TextFieldStory',
    placeholder: 'This is a placeholder',
    value: '',
    isInvalid: false,
    isPositive: false,
    isReadOnly: false,
    isRequired: false,
    errorMessage: '',
    inputFont: 'body',
  },
  render: (props) => {
    const [value, setValue] = useState<string>('');
    return <TextField {...props} value={value} onValueChange={setValue} />;
  },
};

export const WithoutLabel: Story = {
  name: 'Without label',
  render: () => {
    return <TextField placeholder="placeholder" />;
  },
};

export const WithAddons: Story = {
  name: 'With addons',
  render: () => {
    const [value, setValue] = useState<string>('');

    return (
      <Form
        className={formStoryClass}
        onSubmit={(e) => {
          e.preventDefault();
          alert(value);
        }}
      >
        <TextField
          label="With addon"
          value={value}
          onValueChange={setValue}
          startAddon={<MonoAccountCircle />}
          endAddon={<Button icon={<MonoAdd />} isCompact />}
        />
        <Button type="submit">Submit</Button>
      </Form>
    );
  },
};

export const NativeValidation: Story = {
  name: 'Native validation',
  render: () => {
    const [email, setEmail] = useState<string>('');
    const [minMaxLength, setMinMaxLength] = useState<string>('');
    const [url, setUrl] = useState<string>('');
    const [pattern, setPattern] = useState<string>('');

    return (
      <Form
        className={formStoryClass}
        onSubmit={(e) => {
          e.preventDefault();
          alert(JSON.stringify({ email, minMaxLength, url, pattern }));
        }}
      >
        <Text>
          Keep in mind that native validation is only triggered when the a form
          is submitted. for realtime validation use the them `isInvalid` prop.
        </Text>
        <TextField
          isRequired
          type="email"
          validationBehavior="native"
          label="email"
          value={email}
          onValueChange={setEmail}
          placeholder="required (email)"
          minLength={5}
          maxLength={10}
        />
        <TextField
          isRequired
          validationBehavior="native"
          label="min/max length"
          value={minMaxLength}
          onValueChange={setMinMaxLength}
          placeholder="required (minLength 5, maxLength 10)"
          minLength={5}
          maxLength={10}
        />

        <TextField
          isRequired
          type="url"
          validationBehavior="native"
          label="url"
          value={url}
          onValueChange={setUrl}
          placeholder="required (url)"
        />

        <TextField
          isRequired
          validationBehavior="native"
          label="pattern"
          value={pattern}
          onValueChange={setPattern}
          placeholder="required (account address pattern 'starts with k:')"
          pattern="^k:"
        />

        <Button type="submit">Submit</Button>
      </Form>
    );
  },
};

export const ServerValidation: Story = {
  name: 'Server validation',
  render: () => {
    const [value, setValue] = useState<string>('');

    return (
      <Form
        className={formStoryClass}
        onSubmit={(e) => {
          e.preventDefault();
          alert(value);
        }}
        validationErrors={{
          test: 'This is an error message from the server',
        }}
      >
        <Text>
          Server error messages can be provided via the `validationErrors` prop
          on the Form component. please find more info and examples in the{' '}
          <a
            href="https://react-spectrum.adobe.com/react-aria/forms.html?#server-validation"
            target="_blank"
            rel="noreferrer"
          >
            react-aria docs
          </a>
        </Text>

        <TextField
          validationBehavior="native"
          name="test"
          label="min/max length"
          value={value}
          onValueChange={setValue}
          placeholder="required (minLength 5, maxLength 10)"
          minLength={5}
          maxLength={10}
        />
        <Button type="submit">Submit</Button>
      </Form>
    );
  },
};

export const CustomValidation: Story = {
  name: 'Custom validation',
  render: () => {
    return (
      <Form
        className={formStoryClass}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <TextField
          label="Custom validation"
          validationBehavior="aria"
          validate={(value) => {
            if (value.length < 5) {
              return 'Value must be at least 5 characters';
            }
          }}
        />
        <Button type="submit">Submit</Button>
      </Form>
    );
  },
};

export const CustomErrorMessage: Story = {
  name: 'Custom error message',
  render: () => {
    const [value, setValue] = useState<string>('');
    const v = value.toLowerCase();
    return (
      <Form
        className={formStoryClass}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <TextField
          label="Overiding native message"
          validationBehavior="native"
          isRequired
          errorMessage={(validation) => {
            if (validation.validationDetails.valueMissing) {
              return 'Custom message for required';
            }
          }}
        />

        <TextField
          label="What is your favorite crypto token?"
          description={
            v === 'kda' ? 'You are a true believer 🚀' : 'Answer carefully'
          }
          value={value}
          isPositive={v === 'kda'}
          onValueChange={setValue}
          validationBehavior="aria"
          isInvalid={!!v && v !== 'kda'}
          errorMessage={
            v.startsWith('k')
              ? 'You are on the right track'
              : 'Wrong answer think again 🤔'
          }
        />
        <Button type="submit">Submit</Button>
      </Form>
    );
  },
};

export const WithCopyButton: Story = {
  name: 'With copy button',
  render: () => {
    return (
      <TextField
        id="with-copy-button"
        label="With copy button"
        endAddon={<CopyButton inputId="with-copy-button" />}
      />
    );
  },
};
