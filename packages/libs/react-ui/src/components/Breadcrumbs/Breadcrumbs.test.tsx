import { Breadcrumbs } from '@components/Breadcrumbs';
import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, test } from 'vitest';

describe('Breadcrumps', () => {
  test('renders correctly', () => {
    const { getByTestId } = render(<Breadcrumbs.Root />);

    const boxContainer = getByTestId('kda-breadcrumbs');
    expect(boxContainer).toBeInTheDocument();
  });
});
