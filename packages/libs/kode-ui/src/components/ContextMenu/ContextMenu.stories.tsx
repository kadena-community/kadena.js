import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { MonoChevronRight, MonoMoreVert } from '@kadena/kode-icons/system';
import { Button } from '../Button';
import { Stack } from '../Layout';
import { iconControl } from './../../storyDecorators/iconControl';
import type { IContextMenuProps } from './ContextMenu';
import { ContextMenu } from './ContextMenu';
import { ContextMenuDivider } from './ContextMenuDivider';
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
    placement: {
      options: ['bottom start', 'bottom end', 'top start', 'top end'],
      control: {
        type: 'select',
      },
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
    placement: 'bottom end',
  },
  render: ({ ...props }) => {
    return (
      <Stack
        justifyContent="center"
        alignItems="center"
        width="100%"
        style={{ height: '90dvh' }}
      >
        <ContextMenu
          placement={props.placement}
          trigger={<Button endVisual={<MonoMoreVert />} />}
        >
          <ContextMenuItem onClick={() => alert('click')} label="menu item" />
          <ContextMenuItem onClick={() => alert('click 1')} {...props} />
          <ContextMenuItem
            onClick={() => alert('click 2')}
            isDisabled
            label="longer menu item 3"
          />
          <ContextMenuItem
            onClick={() => alert('click 3')}
            label="very very long title menu item 4"
            endVisual={<MonoMoreVert />}
          />
        </ContextMenu>
      </Stack>
    );
  },
};

export const IsOpen: Story = {
  name: 'default Open',
  args: {
    label: 'Hello world',
    endVisual: <MonoChevronRight />,
    isDisabled: false,
    placement: 'bottom end',
  },
  render: ({ ...props }) => {
    return (
      <Stack
        justifyContent="center"
        alignItems="center"
        width="100%"
        style={{ height: '90dvh' }}
      >
        <ContextMenu
          defaultOpen
          placement={props.placement}
          trigger={<Button endVisual={<MonoMoreVert />} />}
        >
          <ContextMenuItem onClick={() => alert('click')} label="menu item" />
          <ContextMenuItem onClick={() => alert('click 1')} {...props} />
          <ContextMenuItem
            onClick={() => alert('click 2')}
            isDisabled
            label="longer menu item 3"
          />
          <ContextMenuItem
            onClick={() => alert('click 3')}
            label="very very long title menu item 4"
            endVisual={<MonoMoreVert />}
          />
        </ContextMenu>
      </Stack>
    );
  },
};

export const IsOpenWithDivider: Story = {
  name: 'with a divider',
  args: {
    label: 'Hello world',
    endVisual: <MonoChevronRight />,
    isDisabled: false,
    placement: 'bottom end',
  },
  render: ({ ...props }) => {
    return (
      <Stack
        justifyContent="center"
        alignItems="center"
        width="100%"
        style={{ height: '90dvh' }}
      >
        <ContextMenu
          defaultOpen
          placement={props.placement}
          trigger={<Button endVisual={<MonoMoreVert />} />}
        >
          <ContextMenuDivider label="Top Section" />
          <ContextMenuItem onClick={() => alert('click')} label="menu item" />
          <ContextMenuItem onClick={() => alert('click 1')} {...props} />
          <ContextMenuDivider label="Section title" />
          <ContextMenuItem
            onClick={() => alert('click 2')}
            isDisabled
            label="longer menu item 3"
          />
          <ContextMenuItem
            onClick={() => alert('click 3')}
            label="very very long title menu item 4"
            endVisual={<MonoMoreVert />}
          />
        </ContextMenu>
      </Stack>
    );
  },
};
