import * as variants from './variants';
import { Grid } from './';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof Grid.Container> = {
  title: 'Grid',
  component: Grid.Container,
  argTypes: {
    spacing: {
      options: Object.keys(
        variants.spacing,
      ) as (keyof typeof variants.spacing)[],
      control: { type: 'select' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Grid.Container>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/react/api/csf
 * to learn how to use render functions.
 */

export const Primary: Story = {
  name: 'Grid',
  args: {
    spacing: 'xl',
  },
  render: ({ spacing }) => (
    <>
      <Grid.Container spacing={spacing}>
        <Grid.Item bg="$blue500">1</Grid.Item>
        <Grid.Item bg="$background">2</Grid.Item>
        <Grid.Item bg="$background">3</Grid.Item>
        <Grid.Item bg="$background">4</Grid.Item>
        <Grid.Item bg="$background">5</Grid.Item>
        <Grid.Item bg="$background">6</Grid.Item>
        <Grid.Item bg="$background">7</Grid.Item>
        <Grid.Item bg="$background">8</Grid.Item>
        <Grid.Item bg="$background">9</Grid.Item>
        <Grid.Item bg="$background">10</Grid.Item>
        <Grid.Item bg="$background">11</Grid.Item>
        <Grid.Item bg="$background">12</Grid.Item>
      </Grid.Container>

      <Grid.Container spacing={spacing}>
        <Grid.Item colStart={4} colEnd={7} bg="$blue500">
          1
        </Grid.Item>
        <Grid.Item bg="$blue500">2</Grid.Item>
        <Grid.Item bg="$blue500">3</Grid.Item>
        <Grid.Item bg="$blue500">4</Grid.Item>
        <Grid.Item bg="$blue500">5</Grid.Item>
        <Grid.Item bg="$blue500">6</Grid.Item>
        <Grid.Item bg="$blue500">7</Grid.Item>
      </Grid.Container>
    </>
  ),
};

export const GridAreas: Story = {
  name: 'GridTemplate areas',
  args: {
    spacing: 'md',
    templateRows: '50px 1fr 30px',
    templateColumns: `150px 1fr`,
    templateAreas: `"header header"
                  "nav main"
                  "nav footer"`,
  },
  render: ({ spacing, templateColumns, templateRows, templateAreas }) => (
    <Grid.Container
      spacing={spacing}
      templateAreas={templateAreas}
      templateRows={templateRows}
      templateColumns={templateColumns}
    >
      <Grid.Item area="header" bg="$blue500">
        0
      </Grid.Item>
      <Grid.Item area="nav" bg="$blue500">
        1
      </Grid.Item>
      <Grid.Item area="main" bg="$blue500">
        2
      </Grid.Item>
      <Grid.Item area="footer" bg="$blue500">
        3
      </Grid.Item>
    </Grid.Container>
  ),
};
