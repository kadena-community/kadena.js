import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import { MonoMoreVert } from '@kadena/kode-icons/system';
import { Button } from '../Button';
import type { ICardProps } from '../Card';
import { ContextMenu } from './ContextMenu';

const meta: Meta<ICardProps> = {
  title: 'Components/ContextMenu',
};

export default meta;
type Story = StoryObj<ICardProps>;

export const Primary: Story = {
  name: 'ContextMenu',
  args: {},
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
      setIsOpen((v) => !v);
    };
    return (
      <>
        <Button onPress={toggleMenu} endVisual={<MonoMoreVert />} />
        {isOpen && <ContextMenu>sdfsdf</ContextMenu>}
      </>
    );
  },
};
