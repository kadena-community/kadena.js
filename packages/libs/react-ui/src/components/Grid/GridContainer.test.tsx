import GridContainer from './GridContainer';

import { render } from '@testing-library/react';
import React from 'react';

describe('GridContainer', () => {
  test('renders correctly', () => {
    const { getByTestId } = render(
      <GridContainer>Hello, GridContainer!</GridContainer>,
    );

    const gridContainer = getByTestId('kda-grid-container');
    expect(gridContainer).toBeInTheDocument();
  });
});
