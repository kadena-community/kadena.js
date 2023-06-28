import { BreadcrumbsContainer } from './Breadcrumbs';

import { render } from '@testing-library/react';
import React from 'react';

describe('Breadcrumps', () => {
  test('renders correctly', () => {
    const { getByTestId } = render(<BreadcrumbsContainer />);

    const boxContainer = getByTestId('kda-breadcrumps');
    expect(boxContainer).toBeInTheDocument();
  });
});
