import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { MonoChevronRight, MonoMoreVert } from '@kadena/kode-icons/system';
import { Button } from '../Button';
import { Stack } from '../Layout';
import { iconControl } from './../../storyDecorators/iconControl';
import type { IContextMenuProps } from './ContextMenu';
import { ContextMenu } from './ContextMenu';
import type { IContextMenuItemProps } from './ContextMenuItem';
import { ContextMenuItem } from './ContextMenuItem';

const meta: Meta<IContextMenuItemProps & IContextMenuProps> = {
  title: 'Overlays/ContextMenu',
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
type Story = StoryObj<IContextMenuItemProps & IContextMenuProps>;

export const Primary: Story = {
  name: 'ContextMenu',
  args: {
    label: 'Hello world',
    endVisual: <MonoChevronRight />,
    isDisabled: false,
  },
  render: ({ ...props }) => {
    return (
      <Stack
        justifyContent="center"
        alignItems="center"
        width="100%"
        style={{ height: '90dvh' }}
      >
        <ContextMenu trigger={<Button endVisual={<MonoMoreVert />} />}>
          <ContextMenuItem onClick={() => alert('click')} label="menu item" />
          <ContextMenuItem {...props} />
          <ContextMenuItem isDisabled label="longer menu item 3" />
          <ContextMenuItem
            label="very very long title menu item 4"
            endVisual={<MonoMoreVert />}
          />
        </ContextMenu>
      </Stack>
    );
  },
};
