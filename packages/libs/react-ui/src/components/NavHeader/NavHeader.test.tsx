import { NavHeader } from '@components/NavHeader';
import { render } from '@testing-library/react';
import React from 'react';

describe('NavHeader', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(
      <NavHeader />,
    );

    const navHeaderContainer = getByTestId('kda-navheader');
    expect(navHeaderContainer).toBeInTheDocument();
  });
});
