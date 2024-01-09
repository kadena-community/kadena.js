import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, test } from 'vitest';
import { BreadcrumbsContainer } from './Breadcrumbs';

describe('Breadcrumps', () => {
  test('renders correctly', () => {
    const { getByTestId } = render(<BreadcrumbsContainer />);

    const boxContainer = getByTestId('kda-breadcrumbs');
    expect(boxContainer).toBeInTheDocument();
  });
});
