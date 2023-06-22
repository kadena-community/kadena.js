jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

import { NavLink } from './index';

import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import React from 'react';

describe('NavLink', () => {
  const mockUseRouter = useRouter as jest.Mock;
  test('renders correctly when active', () => {
    mockUseRouter.mockImplementation(() => ({
      pathname: '/active',
    }));

    render(
      <NavLink href="/active" className="custom-class">
        Link Text
      </NavLink>,
    );

    // Assert that the NavLink component is rendered
    const navLink = screen.getByRole('link');
    expect(navLink).toBeInTheDocument();

    // Assert that the NavLink component has the correct class names
    expect(navLink).toHaveClass('custom-class');
    expect(navLink).toHaveClass('active');

    // Assert that the NavLink component has the correct children
    const navLinkText = screen.getByText('Link Text');
    expect(navLinkText).toBeInTheDocument();
  });

  test('renders correctly when not active', () => {
    mockUseRouter.mockImplementation(() => ({
      pathname: '/not-active',
    }));

    render(
      <NavLink href="/active" className="custom-class">
        Link Text
      </NavLink>,
    );

    // Assert that the NavLink component is rendered
    const navLink = screen.getByRole('link');
    expect(navLink).toBeInTheDocument();

    // Assert that the NavLink component has the correct class names
    expect(navLink).toHaveClass('custom-class');
    expect(navLink).not.toHaveClass('active');

    // Assert that the NavLink component has the correct children
    const navLinkText = screen.getByText('Link Text');
    expect(navLinkText).toBeInTheDocument();
  });
});
