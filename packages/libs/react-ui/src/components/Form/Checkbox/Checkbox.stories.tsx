import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import type { ICheckboxProps } from './Checkbox';
import { Checkbox } from './Checkbox';

const meta: Meta<ICheckboxProps> = {
  title: 'Form/Checkbox',
  parameters: {
    status: { type: 'stable' },
    controls: {
      hideNoControlsWarning: true,
      sort: 'requiredFirst',
    },
    docs: {
      description: {
        component:
          "The Checkbox component is a wrapper around [react-aria's](https://react-spectrum.adobe.com/react-aria/useCheckbox.html) useCheckbox hook. Here are just a couple of examples but you can check their docs for more.",
      },
    },
  },
  argTypes: {
    isDisabled: {
      control: {
        type: 'boolean',
      },
    },
    isSelected: {
      control: {
        type: 'boolean',
      },
    },
    isDeterminate: {
      control: {
        type: 'boolean',
      },
    },
    isReadOnly: {
      control: {
        type: 'boolean',
      },
    },
    inverse: {
      control: {
        type: 'boolean',
      },
    },
  },
};

type CheckboxStoryType = StoryObj<ICheckboxProps>;

export const Base: CheckboxStoryType = {
  args: {
    children: 'Check this box',
  },
  render: (props: ICheckboxProps) => {
    return <Checkbox {...props}>{props.children}</Checkbox>;
  },
};

export const Determinate: CheckboxStoryType = {
  args: {
    children: 'Check this box',
    isDeterminate: true,
  },
  render: (props: ICheckboxProps) => {
    return <Checkbox {...props}>{props.children}</Checkbox>;
  },
};

export const Disabled: CheckboxStoryType = {
  args: {
    children: 'Check this box',
    isDisabled: true,
  },
  render: (props: ICheckboxProps) => {
    return <Checkbox {...props}>{props.children}</Checkbox>;
  },
};

export const DisabledChecked: CheckboxStoryType = {
  args: {
    children: 'Check this box',
    isDisabled: true,
    isSelected: true,
  },
  render: (props: ICheckboxProps) => {
    return <Checkbox {...props}>{props.children}</Checkbox>;
  },
};

export const ReadOnly: CheckboxStoryType = {
  args: {
    children: 'Check this box',
    isReadOnly: true,
  },
  render: (props: ICheckboxProps) => {
    return <Checkbox {...props}>{props.children}</Checkbox>;
  },
};

export const ReadOnlyChecked: CheckboxStoryType = {
  args: {
    children: 'Check this box',
    isReadOnly: true,
    isSelected: true,
  },
  render: (props: ICheckboxProps) => {
    return <Checkbox {...props}>{props.children}</Checkbox>;
  },
};

export default meta;
