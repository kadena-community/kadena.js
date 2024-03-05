import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { styled } from '../../styles';
import { Grid } from './';
import { spacingVariant } from './styles';

const Content = styled('div', {
  bg: '$primarySurface',
  size: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '$sm',
  padding: '$2',
});

const meta: Meta<typeof Grid.Container> = {
  title: 'Layout/Grid',
  component: Grid.Container,
  argTypes: {
    gap: {
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
    gap: 'xl',
  },
  render: ({ gap }) => (
    <>
      <Grid.Container gap={gap}>
        <Grid.Item>
          <Content>1</Content>
        </Grid.Item>
        <Grid.Item>
          <Content>2</Content>
        </Grid.Item>
        <Grid.Item>
          <Content>3</Content>
        </Grid.Item>
        <Grid.Item>
          <Content>4</Content>
        </Grid.Item>
        <Grid.Item>
          <Content>5</Content>
        </Grid.Item>
        <Grid.Item>
          <Content>6</Content>
        </Grid.Item>
        <Grid.Item>
          <Content>7</Content>
        </Grid.Item>
        <Grid.Item>
          <Content>8</Content>
        </Grid.Item>
        <Grid.Item>
          <Content>9</Content>
        </Grid.Item>
        <Grid.Item>
          <Content>10</Content>
        </Grid.Item>
        <Grid.Item>
          <Content>11</Content>
        </Grid.Item>
        <Grid.Item>
          <Content>12</Content>
        </Grid.Item>
        <Grid.Item colStart={4} colEnd={7}>
          <Content>1</Content>
        </Grid.Item>
        <Grid.Item>
          <Content>2</Content>
        </Grid.Item>
        <Grid.Item>
          <Content>3</Content>
        </Grid.Item>
        <Grid.Item>
          <Content>4</Content>
        </Grid.Item>
        <Grid.Item>
          <Content>5</Content>
        </Grid.Item>
        <Grid.Item>
          <Content>6</Content>
        </Grid.Item>
        <Grid.Item>
          <Content>7</Content>
        </Grid.Item>
      </Grid.Container>
    </>
  ),
};

export const GridAreas: Story = {
  name: 'GridTemplate areas',
  args: {
    gap: 'md',
    templateRows: '50px 1fr 30px',
    templateColumns: `150px 1fr`,
    templateAreas: `"header header"
                  "nav main"
                  "nav footer"`,
  },
  render: ({ gap, templateColumns, templateRows, templateAreas }) => (
    <Grid.Container
      gap={gap}
      templateAreas={templateAreas}
      templateRows={templateRows}
      templateColumns={templateColumns}
    >
      <Grid.Item area="header">
        <Content>0</Content>
      </Grid.Item>
      <Grid.Item area="nav">
        <Content>1</Content>
      </Grid.Item>
      <Grid.Item area="main">
        <Content>2</Content>
      </Grid.Item>
      <Grid.Item area="footer">
        <Content>3</Content>
      </Grid.Item>
    </Grid.Container>
  ),
};
