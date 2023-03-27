// Button.stories.ts|tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Testing } from './Testing';

const meta: Meta<typeof Testing> = {
  title: 'Testing',
  component: Testing,
};

export default meta;
type Story = StoryObj<typeof Testing>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/react/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  name: 'Testing',
};
