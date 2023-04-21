import { styled } from '../../styles';

import { spacingVariant } from './styles';
import { Grid } from './';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const Content = styled('div', {});

const meta: Meta<typeof Grid.Container> = {
  title: 'Layout/Grid',
  component: Grid.Container,
  argTypes: {
    spacing: {
      options: Object.keys(spacingVariant) as (keyof typeof spacingVariant)[],
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
        <Grid.Item>
          <Content css={{ bg: '$neutral3' }}>1</Content>
        </Grid.Item>
        <Grid.Item>
          <Content css={{ bg: '$neutral3' }}>2</Content>
        </Grid.Item>
        <Grid.Item>
          <Content css={{ bg: '$neutral3' }}>3</Content>
        </Grid.Item>
        <Grid.Item>
          <Content css={{ bg: '$neutral3' }}>4</Content>
        </Grid.Item>
        <Grid.Item>
          <Content css={{ bg: '$neutral3' }}>5</Content>
        </Grid.Item>
        <Grid.Item>
          <Content css={{ bg: '$neutral3' }}>6</Content>
        </Grid.Item>
        <Grid.Item>
          <Content css={{ bg: '$neutral3' }}>7</Content>
        </Grid.Item>
        <Grid.Item>
          <Content css={{ bg: '$neutral3' }}>8</Content>
        </Grid.Item>
        <Grid.Item>
          <Content css={{ bg: '$neutral3' }}>9</Content>
        </Grid.Item>
        <Grid.Item>
          <Content css={{ bg: '$neutral3' }}>10</Content>
        </Grid.Item>
        <Grid.Item>
          <Content css={{ bg: '$neutral3' }}>11</Content>
        </Grid.Item>
        <Grid.Item>
          <Content css={{ bg: '$neutral3' }}>12</Content>
        </Grid.Item>
      </Grid.Container>

      <Grid.Container spacing={spacing}>
        <Grid.Item colStart={4} colEnd={7}>
          <Content css={{ bg: '$primarySurface' }}>1</Content>
        </Grid.Item>
        <Grid.Item>
          <Content css={{ bg: '$primarySurface' }}>2</Content>
        </Grid.Item>
        <Grid.Item>
          <Content css={{ bg: '$primarySurface' }}>3</Content>
        </Grid.Item>
        <Grid.Item>
          <Content css={{ bg: '$primarySurface' }}>4</Content>
        </Grid.Item>
        <Grid.Item>
          <Content css={{ bg: '$primarySurface' }}>5</Content>
        </Grid.Item>
        <Grid.Item>
          <Content css={{ bg: '$primarySurface' }}>6</Content>
        </Grid.Item>
        <Grid.Item>
          <Content css={{ bg: '$primarySurface' }}>7</Content>
        </Grid.Item>
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
      <Grid.Item area="header">
        <Content css={{ bg: '$primarySurface' }}>0</Content>
      </Grid.Item>
      <Grid.Item area="nav">
        <Content css={{ bg: '$primarySurface' }}>1</Content>
      </Grid.Item>
      <Grid.Item area="main">
        <Content css={{ bg: '$primarySurface' }}>2</Content>
      </Grid.Item>
      <Grid.Item area="footer">
        <Content css={{ bg: '$primarySurface' }}>3</Content>
      </Grid.Item>
    </Grid.Container>
  ),
};
