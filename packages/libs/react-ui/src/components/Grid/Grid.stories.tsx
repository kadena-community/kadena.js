import { gapVariants } from './Grid.css';
import { ContentClass } from './stories.css';
import { Grid } from '.';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof Grid.Container> = {
  title: 'Layout/Grid',
  component: Grid.Container,
  argTypes: {
    spacing: {
      options: Object.keys(gapVariants) as (keyof typeof gapVariants)[],
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
    spacing: '$xl',
  },
  render: ({ spacing }) => (
    <>
      <Grid.Container spacing={spacing}>
        {Array.from(new Array(12)).map((empty, i) => (
          <Grid.Item key={i}>
            <div className={ContentClass}>{i}</div>
          </Grid.Item>
        ))}

        <Grid.Item colStart={4} colEnd={7}>
          <div className={ContentClass}>1</div>
        </Grid.Item>
        <Grid.Item>
          <div className={ContentClass}>2</div>
        </Grid.Item>
        <Grid.Item>
          <div className={ContentClass}>3</div>
        </Grid.Item>
        <Grid.Item>
          <div className={ContentClass}>4</div>
        </Grid.Item>
        <Grid.Item>
          <div className={ContentClass}>5</div>
        </Grid.Item>
        <Grid.Item>
          <div className={ContentClass}>6</div>
        </Grid.Item>
        <Grid.Item>
          <div className={ContentClass}>7</div>
        </Grid.Item>
      </Grid.Container>
    </>
  ),
};

export const GridAreas: Story = {
  name: 'GridTemplate areas',
  args: {
    spacing: '$md',
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
      <Grid.Item area="header">
        <div className={ContentClass}>0</div>
      </Grid.Item>
      <Grid.Item area="nav">
        <div className={ContentClass}>1</div>
      </Grid.Item>
      <Grid.Item area="main">
        <div className={ContentClass}>2</div>
      </Grid.Item>
      <Grid.Item area="footer">
        <div className={ContentClass}>3</div>
      </Grid.Item>
    </Grid.Container>
  ),
};
