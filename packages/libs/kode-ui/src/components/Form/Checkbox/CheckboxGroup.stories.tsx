import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { getVariants } from '../../../storyDecorators';
import { Checkbox } from './Checkbox';
import { groupClass } from './Checkbox.css';
import type { ICheckboxProps } from './CheckboxGroup';
import { CheckboxGroup } from './CheckboxGroup';

const directions = getVariants(groupClass);

const meta: Meta<ICheckboxProps> = {
  title: 'Form/CheckboxGroup',
  parameters: {
    status: { type: 'stable' },
    controls: {
      hideNoControlsWarning: true,
      sort: 'requiredFirst',
    },
    docs: {
      description: {
        component: 'The checkbox component',
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

type CheckboxGroupStoryType = StoryObj<ICheckboxProps>;

const checkboxes = Array.from(Array(10).keys()).map((key) => {
  return (
    <Checkbox key={key} value={`value:${key}`}>{`Option: ${key}`}</Checkbox>
  );
});
//
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

export const Base: CheckboxGroupStoryType = {
  args: {
    direction: 'row',
  },
  render: (props: ICheckboxProps) => {
    return (
      <InverseWrapper inversed={props.inverse}>
        <CheckboxGroup {...props}>{checkboxes}</CheckboxGroup>
      </InverseWrapper>
    );
  },
};

export const _Horizontal: CheckboxGroupStoryType = {
  args: {
    direction: 'row',
    label: 'Label',
    tag: 'tag',
    info: 'info',
    description: 'description',
  },
  render: (props: ICheckboxProps) => {
    return <CheckboxGroup {...props}>{checkboxes}</CheckboxGroup>;
  },
};

export const _Vertical: CheckboxGroupStoryType = {
  args: {
    direction: 'column',
    label: 'Label',
    tag: 'tag',
    description: 'description',
  },
  render: (props: ICheckboxProps) => {
    return <CheckboxGroup {...props}>{checkboxes}</CheckboxGroup>;
  },
};

export const MultilineLabel: CheckboxGroupStoryType = {
  args: {
    direction: 'row',
    label: 'Label',
    tag: 'tag',
    info: 'info',
    description: 'description',
  },
  render: (props: ICheckboxProps) => {
    return (
      <CheckboxGroup {...props}>
        <Checkbox value="something">
          Hello this is a checkbox with a long label, probably enough words to
          cause the checkbox label to be multiline
        </Checkbox>
        <Checkbox value="something else">
          Hello this is a checkbox with a long label, probably enough words to
          cause the checkbox label to be multiline
        </Checkbox>
        <Checkbox value="3">Option: 3</Checkbox>
        <Checkbox value="4">Option: 4</Checkbox>
      </CheckboxGroup>
    );
  },
};

export default meta;
