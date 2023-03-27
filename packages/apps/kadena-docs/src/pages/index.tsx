import React from 'react';
import { Grid } from '@kadena-ui/react-components';

export default function Home(): JSX.Element {
  return (
    <main>
      <Grid.Container>
        <Grid.Item
          colStart={2}
          colEnd={11}
          rowStart={1}
          rowEnd={5}
          bg="$blue500"
        >
          1
        </Grid.Item>
        <Grid.Item bg="$blue500">2</Grid.Item>
        <Grid.Item bg="$blue500">3</Grid.Item>
        <Grid.Item bg="$blue500">4</Grid.Item>
        <Grid.Item bg="$blue500">5</Grid.Item>
        <Grid.Item bg="$blue500">6</Grid.Item>
        <Grid.Item bg="$blue500">7</Grid.Item>
        <Grid.Item bg="$blue500">8</Grid.Item>
        <Grid.Item bg="$blue500">9</Grid.Item>
        <Grid.Item bg="$blue500">10</Grid.Item>
        <Grid.Item bg="$blue500">11</Grid.Item>
        <Grid.Item bg="$blue500">12</Grid.Item>
      </Grid.Container>

      <br />
      <br />
      <br />
      <Grid.Container
        gap="$4"
        templateAreas={`"header header"
                  "nav main"
                  "nav footer"`}
        templateRows={'50px 1fr 30px'}
        templateColumns={'150px 1fr'}
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
    </main>
  );
}
