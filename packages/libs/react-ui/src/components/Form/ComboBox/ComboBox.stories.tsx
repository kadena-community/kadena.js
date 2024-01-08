import { SystemIcon } from '@components/Icon';
import { Box } from '@components/Layout';
import { Text } from '@components/Typography';
import { onLayer1 } from '@storyDecorators';
import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '@theme/index';
import React from 'react';
import { Item } from 'react-stately';
import type { IComboBoxProps } from './ComboBox';
import { ComboBox } from './ComboBox';

interface Option {}

const meta: Meta<IComboBoxProps<Option>> = {
  title: 'Form/ComboBox',
  component: ComboBox,
  decorators: [onLayer1],
};

export default meta;

type Story = StoryObj<IComboBoxProps<Option>>;

export const Test: Story = {
  name: 'ComboBox',
  args: {
    allowsCustomValue: false,
  },
  render: ({ allowsCustomValue }) => {
    const defaultValue = 'Nothing selected yet';
    const [selectedValue, setSelectedValue] =
      React.useState<string>(defaultValue);
    return (
      <>
        <ComboBox
          label="Favorite Animal"
          allowsCustomValue={allowsCustomValue}
          id="my-combobox"
          width={tokens.kda.foundation.layout.content.maxWidth}
          onInputChange={(value) => setSelectedValue(value)}
          startIcon={<SystemIcon.KeyIconFilled />}
        >
          <Item key="red panda">Red Panda</Item>
          <Item key="cat">Cat</Item>
          <Item key="dog">Dog</Item>
          <Item key="aardvark">Aardvark</Item>
          <Item key="kangaroo">Kangaroo</Item>
          <Item key="snake">Snake</Item>
        </ComboBox>
        <Box marginBottom={'$4'} />
        <Text>Selected value:</Text>
        <Text>{selectedValue.length ? selectedValue : defaultValue}</Text>
      </>
    );
  },
};
