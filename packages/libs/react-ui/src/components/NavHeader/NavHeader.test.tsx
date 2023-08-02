import { NavHeader } from '@components/NavHeader';
import { render } from '@testing-library/react';
import React from 'react';

// ? Since we're (likely) using Chromatic soon, I'll hold off on adding more tests here.

describe('NavHeader', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<NavHeader />);

    const navHeaderContainer = getByTestId('kda-navheader');
    expect(navHeaderContainer).toBeInTheDocument();
  });
});
