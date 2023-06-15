import { SystemIcons } from './../../';
import { IModalProps, Modal } from '.';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<{} & IModalProps> = {
  title: 'Modal',
  argTypes: {},
};

export default meta;
type Story = StoryObj<{} & IModalProps>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/react/api/csf
 * to learn how to use render functions.
 */

export const Primary: Story = {
  name: 'Modal',

  render: () => {
    return <Modal>test</Modal>;
  },
};
