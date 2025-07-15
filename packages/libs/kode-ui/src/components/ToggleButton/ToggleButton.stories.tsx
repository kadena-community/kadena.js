import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import { Stack } from '../Layout';
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
  },
};

type ToggleButtonStoryType = StoryObj<IToggleButtonProps>;

export const Base: ToggleButtonStoryType = {
  args: {
    'aria-label': 'Check this toggle',
  },
  render: (props: IToggleButtonProps) => {
    const [selected, setSelected] = useState(false);
    const [selected2, setSelected2] = useState(true);
    const [selected3, setSelected3] = useState(false);
    return (
      <Stack flexDirection="column" gap="xl">
        <ToggleButton
          isSelected={selected}
          onPress={() => setSelected((v) => !v)}
        />
        <ToggleButton
          isSelected={selected2}
          onPress={() => setSelected2((v) => !v)}
        />

        <ToggleButton
          isDisabled
          isSelected={selected3}
          onPress={() => setSelected3((v) => !v)}
        />
        <ToggleButton
          isDisabled
          isSelected={true}
          onPress={() => setSelected3((v) => !v)}
        />
      </Stack>
    );
  },
};

export default meta;
