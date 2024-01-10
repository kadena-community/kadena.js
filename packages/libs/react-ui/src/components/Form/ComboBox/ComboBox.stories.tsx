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

interface IOption {}

const meta: Meta<
  {
    icon: keyof typeof SystemIcon;
  } & IComboBoxProps<IOption>
> = {
  title: 'Form/ComboBox',
  component: ComboBox,
  decorators: [onLayer1],
  argTypes: {
    icon: {
      options: [
        undefined,
        ...(Object.keys(SystemIcon) as (keyof typeof SystemIcon)[]),
      ],
      control: {
        type: 'select',
      },
    },
  },
};

export default meta;

type Story = StoryObj<
  { icon: keyof typeof SystemIcon } & IComboBoxProps<IOption>
>;

export const Test: Story = {
  name: 'ComboBox',
  args: {
    allowsCustomValue: false,
    icon: 'KIcon',
  },
  render: ({ allowsCustomValue, icon }) => {
    const defaultValue = 'Nothing selected yet';
    const [selectedValue, setSelectedValue] =
      React.useState<string>(defaultValue);
    const Icon = icon && SystemIcon[icon];
    return (
      <>
        <ComboBox
          label="Favorite Animal"
          allowsCustomValue={allowsCustomValue}
          id="my-combobox"
          width={tokens.kda.foundation.layout.content.maxWidth}
          onInputChange={(value) => setSelectedValue(value)}
          startIcon={icon !== undefined ? <Icon /> : undefined}
          disabledKeys={['aardvark', 'kangaroo']}
        >
          <Item key="red panda">Red Panda</Item>
          <Item key="cat">Cat</Item>
          <Item key="dog">Dog</Item>
          <Item key="aardvark">Aardvark</Item>
          <Item key="kangaroo">Kangaroo</Item>
          <Item key="snake">Snake</Item>
        </ComboBox>
        <Box marginBlockEnd="sm" />
        <Text>Selected value:</Text>
        <Text>{selectedValue.length ? selectedValue : defaultValue}</Text>
      </>
    );
  },
};

export const ComboBoxDynamicCollection: Story = {
  name: 'ComboBox dynamic collection',
  render: () => {
    const options = Array.from({ length: 100 }, (_, i) => ({
      id: `ledger-key-${i}`,
      name: `${i}`,
    }));
    return (
      <ComboBox
        label="Ledger key"
        allowsCustomValue
        id="ledger-key-combobox"
        width={280}
        startIcon={<SystemIcon.KeyIconFilled />}
        defaultItems={options}
      >
        {(item) => <Item>{item.name}</Item>}
      </ComboBox>
    );
  },
};
