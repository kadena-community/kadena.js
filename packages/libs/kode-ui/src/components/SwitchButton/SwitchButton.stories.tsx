import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import { MonoAdd, MonoRemove } from '@kadena/kode-icons/system';
import { Stack } from '../Layout';
import type { ISwitchButtonProps } from './SwitchButton';
import { SwitchButton } from './SwitchButton';

const meta: Meta<ISwitchButtonProps> = {
  title: 'Components/SwitchButton',
  parameters: {
    status: { type: 'development' },
    controls: {
      hideNoControlsWarning: true,
      sort: 'requiredFirst',
    },
    docs: {
      description: {
        component:
          "The SwitchButton component is a wrapper around [react-aria's](https://react-spectrum.adobe.com/react-aria/useToggleButton.html#usetogglebutton) usetogglebutton hook. Here are just a couple of examples but you can check their docs for more.",
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

type SwitchButtonStoryType = StoryObj<ISwitchButtonProps>;

export const Base: SwitchButtonStoryType = {
  args: {
    'aria-label': 'Check this toggle',
  },
  render: (props: ISwitchButtonProps) => {
    const [selected, setSelected] = useState(false);
    const [selected2, setSelected2] = useState(true);
    const [selected3, setSelected3] = useState(false);
    return (
      <Stack flexDirection="column" gap="xl">
        <SwitchButton
          isSelected={selected}
          onPress={() => setSelected((v) => !v)}
        />
        <SwitchButton
          isSelected={selected2}
          onPress={() => setSelected2((v) => !v)}
          onVisual={<MonoAdd />}
          offVisual={<MonoRemove />}
        />

        <SwitchButton
          isDisabled
          isSelected={selected3}
          onPress={() => setSelected3((v) => !v)}
          offVisual={<MonoRemove />}
        />
        <SwitchButton
          isDisabled
          isSelected={true}
          onPress={() => setSelected3((v) => !v)}
          onVisual={<MonoAdd />}
        />
      </Stack>
    );
  },
};

export default meta;
