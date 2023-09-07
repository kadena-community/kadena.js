import { ModalProvider } from '@kadena/react-ui';

import { PageHelpful } from './PageHelpful';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const selectOptions: string[] = ['p', 'span'];

const meta: Meta = {
  title: 'Components/PageHelpful',
  argTypes: {
    as: {
      options: selectOptions,
      control: {
        type: 'select',
      },
    },
    bold: {
      control: {
        type: 'boolean',
      },
    },
  },
};

export default meta;

export const Default: StoryObj = {
  name: 'Default',
  render: () => (
    <ModalProvider>
      <div id="modalportal"></div>
      <PageHelpful editLink="/hello/world" />
    </ModalProvider>
  ),
};
