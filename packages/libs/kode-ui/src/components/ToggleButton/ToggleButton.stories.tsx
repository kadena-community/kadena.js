import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import type { IToggleButtonProps } from './ToggleButton';
import { ToggleButton } from './ToggleButton';

const meta: Meta<IToggleButtonProps> = {
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
    'aria-label': {
      default: 'This is a label',
      control: {
        type: 'text',
      },
    },
    isDisabled: {
      control: {
        type: 'boolean',
      },
    },

    isSelected: {
      default: true,
      control: {
        type: 'boolean',
      },
    },
  },
};

type ToggleButtonStoryType = StoryObj<IToggleButtonProps>;

// Just to make the inverse prop visible in the story
const InverseWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        padding: '1rem',
      }}
    >
      {children}
    </div>
  );
};

export const Base: ToggleButtonStoryType = {
  args: {
    'aria-label': 'Check this toggle',
  },
  render: (props: IToggleButtonProps) => {
    return (
      <InverseWrapper>
        <ToggleButton {...props} />
      </InverseWrapper>
    );
  },
};

export default meta;
