import { Footer } from './Footer';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Footer> = {
  title: 'Layout/Footer',
  component: Footer,
};

export default meta;
type Story = StoryObj<typeof Footer>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/react/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  name: 'Footer',
};
