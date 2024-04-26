import { MonoAccountBalance, MonoCopyAll } from '@kadena/react-icons/system';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { withContentWidth } from '../../../storyDecorators';
import { getVariants } from '../../../storyDecorators/getVariants';
import { atoms } from '../../../styles';
import { Button } from '../../Button';
import { Text } from '../../Typography/Text/Text';
import { Form } from '../Form';
import { input } from '../Form.css';
import { TextField } from '../TextField';
import type { ITextFieldProps } from './TextField';

import { iconControl } from '../../../storyDecorators/iconControl';

const { variant, fontType, size } = getVariants(input);

const formStoryClass = atoms({
  display: 'flex',
  flexDirection: 'column',
  gap: 'md',
});

const meta: Meta<ITextFieldProps> = {
  title: 'Form/TextField',
  component: TextField,
  decorators: [withContentWidth],
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
    errorMessage: '',
    isDisabled: false,
    isRequired: false,
  },
};

export default meta;

type Story = StoryObj<ITextFieldProps>;

export const TextFieldStory: Story = {
  name: 'TextField',
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

export const WithErrorMessage: Story = {
  render: () => {
    return (
      <TextField
        errorMessage="Something went wrong"
        isInvalid
        placeholder="placeholder"
      />
    );
  },
};

export const Disabled: Story = {
  render: (props) => {
    return (
      <TextField
        {...props}
        variant="readonly"
        size="md"
        label="With addon"
        placeholder="With addon"
        startVisual={<MonoAccountBalance />}
        endAddon={
          <Button
            isDisabled
            variant="transparent"
            onClick={(e) => e.stopPropagation()}
          >
            Button
          </Button>
        }
      />
    );
  },
};

export const Variants: Story = {
  render: (props) => {
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
          {...props}
          size="sm"
          label="Default"
          placeholder="Default"
          value={value}
          onValueChange={setValue}
          startVisual={<MonoAccountBalance />}
          endAddon={
            <Button isCompact variant="transparent">
              Button
            </Button>
          }
        />
        <TextField
          {...props}
          size="md"
          label="readonly"
          variant="readonly"
          placeholder="Readonly"
          value={value}
          onValueChange={setValue}
          startVisual={<MonoAccountBalance />}
          endAddon={<Button variant="transparent">Button</Button>}
        />
        <TextField
          {...props}
          size="md"
          label="negative"
          variant="negative"
          placeholder="Negative"
          value={value}
          onValueChange={setValue}
          startVisual={<MonoAccountBalance />}
          endAddon={<Button variant="transparent">Button</Button>}
        />
        <TextField
          {...props}
          size="md"
          label="positive"
          variant="positive"
          placeholder="Positive"
          value={value}
          onValueChange={setValue}
          startVisual={<MonoAccountBalance />}
          endAddon={<Button variant="transparent">Button</Button>}
        />
        <TextField
          {...props}
          size="md"
          label="info"
          variant="info"
          placeholder="Info"
          value={value}
          onValueChange={setValue}
          startVisual={<MonoAccountBalance />}
          endAddon={<Button variant="transparent">Button</Button>}
        />
        <TextField
          {...props}
          size="md"
          label="warning"
          variant="warning"
          placeholder="Warning"
          value={value}
          onValueChange={setValue}
          startVisual={<MonoAccountBalance />}
          endAddon={<Button variant="transparent">Button</Button>}
        />
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
          variant="positive"
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
        endAddon={
          <Button variant="transparent" onPress={() => alert('Copied!')}>
            <MonoCopyAll />
          </Button>
        }
      />
    );
  },
};
