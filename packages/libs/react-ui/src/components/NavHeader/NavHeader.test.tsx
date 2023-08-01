import { NavHeader } from '@components/NavHeader';
import { render } from '@testing-library/react';
import React from 'react';

describe('NavHeader', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(
      <NavHeader.Root>Hello, Header!</NavHeader.Root>,
    );

    const navHeaderContainer = getByTestId('kda-navheader');
    expect(navHeaderContainer).toBeInTheDocument();
  });
});
