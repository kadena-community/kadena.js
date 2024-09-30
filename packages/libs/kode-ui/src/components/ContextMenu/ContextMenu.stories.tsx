import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import { MonoChevronRight, MonoMoreVert } from '@kadena/kode-icons/system';
import { Button } from '../Button';
import { iconControl } from './../../storyDecorators/iconControl';
import type { IContextMenuUtemProps } from './ContenxtMenuItem';
import { ContextMenuItem } from './ContenxtMenuItem';
import { ContextMenu } from './ContextMenu';

const meta: Meta<IContextMenuUtemProps> = {
  title: 'Components/ContextMenu',
  parameters: {
    status: { type: 'valid' },
    docs: {
      description: {
        component: '',
      },
    },
  },
  argTypes: {
    endVisual: iconControl,
    label: {
      type: 'string',
    },
    isDisabled: {
      type: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<IContextMenuUtemProps>;

export const Primary: Story = {
  name: 'ContextMenu',
  args: {
    label: 'Hello world',
    endVisual: <MonoChevronRight />,
    isDisabled: false,
  },
  render: (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
      setIsOpen((v) => !v);
    };
    return (
      <>
        <Button onPress={toggleMenu} endVisual={<MonoMoreVert />} />
        {!isOpen && (
          <ContextMenu>
            <ContextMenuItem label="menu item" />
            <ContextMenuItem {...props} />
            <ContextMenuItem isDisabled label="menu item 3" />
            <ContextMenuItem label="menu item 4" />
          </ContextMenu>
        )}
      </>
    );
  },
};
