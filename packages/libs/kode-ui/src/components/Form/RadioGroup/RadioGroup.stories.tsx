import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { getVariants } from '../../../storyDecorators';
import { Radio } from './Radio';
import { groupClass } from './Radio.css';
import type { IRadioGroupProps } from './RadioGroup';
import { RadioGroup } from './RadioGroup';

const directions = getVariants(groupClass);

const meta: Meta<IRadioGroupProps> = {
  title: 'Form/RadioGroup',
  parameters: {
    status: { type: 'stable' },
    controls: {
      hideNoControlsWarning: true,
      sort: 'requiredFirst',
    },
    docs: {
      description: {
        component:
          "The RadioGroup component is a wrapper around [react-aria's](https://react-spectrum.adobe.com/react-aria/useRadioGroup.html) useRadioGroup hook. Here are just a couple of examples but you can check their docs for more.",
      },
    },
  },
  argTypes: {
    isDisabled: {
      control: {
        type: 'boolean',
      },
    },
    direction: {
      options: directions.direction,
      control: {
        type: 'select',
      },
    },
    isReadOnly: {
      control: {
        type: 'boolean',
      },
    },
    isInvalid: {
      control: {
        type: 'boolean',
      },
    },
    label: {
      control: {
        type: 'text',
      },
    },
    errorMessage: {
      control: {
        type: 'text',
      },
    },
    description: {
      control: {
        type: 'text',
      },
    },
    tag: {
      control: {
        type: 'text',
      },
    },
    info: {
      control: {
        type: 'text',
      },
    },
    inverse: {
      control: {
        type: 'boolean',
      },
    },
    formFieldDirection: {
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
};

type RadioGroupStoryType = StoryObj<IRadioGroupProps>;

const radios = Array.from(Array(10).keys()).map((key) => {
  return <Radio key={key} value={`value:${key}`}>{`Option: ${key}`}</Radio>;
});

// Just to make the inverse prop visible in the story
const InverseWrapper = ({
  children,
  inversed,
}: {
  children: React.ReactNode;
  inversed?: boolean;
}) => {
  return (
    <div
      style={{
        padding: '1rem',
        backgroundColor: inversed ? 'black' : 'transparent',
      }}
    >
      {children}
    </div>
  );
};

export const Base: RadioGroupStoryType = {
  args: {
    direction: 'row',
  },
  render: (props: IRadioGroupProps) => {
    return (
      <InverseWrapper inversed={props.inverse}>
        <RadioGroup {...props}>{radios}</RadioGroup>
      </InverseWrapper>
    );
  },
};

export const _Horizontal: RadioGroupStoryType = {
  args: {
    direction: 'row',
    label: 'Label',
    tag: 'tag',
    info: 'info',
    description: 'description',
  },
  render: (props: IRadioGroupProps) => {
    return <RadioGroup {...props}>{radios}</RadioGroup>;
  },
};

export const _Vertical: RadioGroupStoryType = {
  args: {
    direction: 'column',
    label: 'Label',
    tag: 'tag',
    description: 'description',
  },
  render: (props: IRadioGroupProps) => {
    return <RadioGroup {...props}>{radios}</RadioGroup>;
  },
};

export const MultilineLabel: RadioGroupStoryType = {
  args: {
    direction: 'row',
    label: 'Label',
    tag: 'tag',
    info: 'info',
    description: 'description',
  },
  render: (props: IRadioGroupProps) => {
    return (
      <RadioGroup {...props}>
        <Radio value="something">
          Hello this is a radio button with a long label, probably enough words
          to cause the radio button label to be multiline
        </Radio>
        <Radio value="something else">
          Hello this is a radio button with a long label, probably enough words
          to cause the radio button label to be multiline
        </Radio>
        <Radio value="3">Option: 3</Radio>
        <Radio value="4">Option: 4</Radio>
      </RadioGroup>
    );
  },
};

export default meta;
