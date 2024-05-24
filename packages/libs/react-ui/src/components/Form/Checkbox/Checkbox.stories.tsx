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
  },
};

type CheckboxStoryType = StoryObj<ICheckboxProps>;

export const _Base: CheckboxStoryType = {
  args: {
    children: 'Check this box',
  },
  render: (props: ICheckboxProps) => {
    return <Checkbox {...props}>{props.children}</Checkbox>;
  },
};

export const _Determinate: CheckboxStoryType = {
  args: {
    children: 'Check this box',
    isDeterminate: true,
  },
  render: (props: ICheckboxProps) => {
    return <Checkbox {...props}>{props.children}</Checkbox>;
  },
};

export const _Disabled: CheckboxStoryType = {
  args: {
    children: 'Check this box',
    isDisabled: true,
  },
  render: (props: ICheckboxProps) => {
    return <Checkbox {...props}>{props.children}</Checkbox>;
  },
};

export const _DisabledChecked: CheckboxStoryType = {
  args: {
    children: 'Check this box',
    isDisabled: true,
    isSelected: true,
  },
  render: (props: ICheckboxProps) => {
    return <Checkbox {...props}>{props.children}</Checkbox>;
  },
};

export const _ReadOnly: CheckboxStoryType = {
  args: {
    children: 'Check this box',
    isReadOnly: true,
  },
  render: (props: ICheckboxProps) => {
    return <Checkbox {...props}>{props.children}</Checkbox>;
  },
};

export const _ReadOnlyChecked: CheckboxStoryType = {
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
