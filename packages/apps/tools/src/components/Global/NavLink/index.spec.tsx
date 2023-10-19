import { cleanup, render, screen } from '@testing-library/react';
import mock from 'next-router-mock';
import React from 'react';
import { NavLink } from './index';

describe('NavLink', () => {
  it('renders correctly when active', async () => {
    await mock.push('/active');

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

  it('renders correctly when not active', async () => {
    await mock.push('/not-active');

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
