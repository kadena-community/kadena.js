import type { Meta, StoryObj } from '@storybook/react';
import React, { useRef, useState } from 'react';

import { MonoChevronRight, MonoMoreVert } from '@kadena/kode-icons/system';
import { Button } from '../Button';
import { Stack } from '../Layout';
import { iconControl } from './../../storyDecorators/iconControl';
import type { IContextMenuItemProps } from './ContenxtMenuItem';
import { ContextMenuItem } from './ContenxtMenuItem';
import type { IContextMenuProps } from './ContextMenu';
import { ContextMenu } from './ContextMenu';

const meta: Meta<IContextMenuItemProps & IContextMenuProps> = {
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
    position: {
      control: {
        type: 'select',
      },
      options: ['topLeft', 'bottomLeft', 'topRight', 'bottomRight'],
    },
  },
};

export default meta;
type Story = StoryObj<IContextMenuItemProps & IContextMenuProps>;

export const Primary: Story = {
  name: 'ContextMenu',
  args: {
    label: 'Hello world',
    endVisual: <MonoChevronRight />,
    isDisabled: false,
    position: 'bottomLeft',
  },
  render: ({ position, ...props }) => {
    const ref = useRef<HTMLButtonElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
      setIsOpen((v) => !v);
    };
    return (
      <Stack
        justifyContent="center"
        alignItems="center"
        width="100%"
        style={{ height: '90dvh' }}
      >
        <Button ref={ref} onPress={toggleMenu} endVisual={<MonoMoreVert />} />
        {!isOpen && (
          <ContextMenu parentRef={ref} position={position}>
            <ContextMenuItem onPress={() => alert('click')} label="menu item" />
            <ContextMenuItem {...props} />
            <ContextMenuItem isDisabled label="menu item 3" />
            <ContextMenuItem label="menu item 4" />
          </ContextMenu>
        )}
      </Stack>
    );
  },
};
