import { onLayer1 } from '@storyDecorators';
import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '@theme/index';
import { vars } from '@theme/vars.css';
import React from 'react';
import { Item } from 'react-stately';
import type { IComboBoxProps } from './ComboBox';
import { ComboBox } from './ComboBox';

const meta: Meta<IComboBoxProps<{ something: 'else' }>> = {
  title: 'Form/ComboBox',
  component: ComboBox,
  decorators: [onLayer1],
};

export default meta;

type Story = StoryObj;

export const Test: Story = {
  name: 'ComboBox',
  render: () => {
    return (
      <ComboBox
        label="Favorite Animal"
        allowsCustomValue
        id="my-combobox"
        width={tokens.kda.foundation.layout.content.maxWidth}
      >
        <Item key="red panda">Red Panda</Item>
        <Item key="cat">Cat</Item>
        <Item key="dog">Dog</Item>
        <Item key="aardvark">Aardvark</Item>
        <Item key="kangaroo">Kangaroo</Item>
        <Item key="snake">Snake</Item>
      </ComboBox>
    );
  },
};
