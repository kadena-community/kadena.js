import { Box } from '@components/Layout';
import { Text } from '@components/Typography';
import { onLayer1 } from '@storyDecorators';
import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '@theme/index';
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
    const [selectedValue, setSelectedValue] = React.useState<string | null>(
      'Nothing selected yet',
    );
    return (
      <>
        <ComboBox
          label="Favorite Animal"
          allowsCustomValue
          id="my-combobox"
          width={tokens.kda.foundation.layout.content.maxWidth}
          onInputChange={(value) => setSelectedValue(value)}
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
        <Text>{selectedValue}</Text>
      </>
    );
  },
};
