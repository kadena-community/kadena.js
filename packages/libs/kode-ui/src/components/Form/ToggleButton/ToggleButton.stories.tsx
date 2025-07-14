import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import type { ICheckboxProps } from './../Checkbox/Checkbox';
import type { IToggleButtonProps } from './ToggleButton';
import { ToggleButton } from './ToggleButton';

const meta: Meta<ICheckboxProps> = {
  title: 'Components/ToggleButton',
  parameters: {
    status: { type: 'development' },
    controls: {
      hideNoControlsWarning: true,
      sort: 'requiredFirst',
    },
    docs: {
      description: {
        component:
          "The ToggleButton component is a wrapper around [react-aria's](https://react-spectrum.adobe.com/react-aria/useToggleButton.html#usetogglebutton) usetogglebutton hook. Here are just a couple of examples but you can check their docs for more.",
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
  },
};

type ToggleButtonStoryType = StoryObj<IToggleButtonProps>;

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

export const Base: ToggleButtonStoryType = {
  args: {
    children: 'Check this toggle',
  },
  render: (props: ICheckboxProps) => {
    return (
      <InverseWrapper inversed={props.inverse}>
        <ToggleButton {...props}>{props.children}</ToggleButton>
      </InverseWrapper>
    );
  },
};

export default meta;
