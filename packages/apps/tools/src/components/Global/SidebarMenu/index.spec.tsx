import { render, screen } from '@testing-library/react';
import mock from 'next-router-mock';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { SidebarMenu } from './index';

describe('SidebarMenu', () => {
  it('renders correctly with menu items', async () => {
    await mock.push('/transactions');

    const { getByTestId } = render(<SidebarMenu />);

    // Assert that the SidebarMenu component is rendered
    const sidebarMenu = getByTestId('navigation');
    expect(sidebarMenu).toBeInTheDocument();

    // Assert that menu items are rendered
    const menuItems = screen.getAllByRole('link');
    expect(menuItems).toHaveLength(3); // Update the expected length based on your menu configuration

    // Assert the text content of menu items
    const menuItemTexts = menuItems.map((menuItem) => menuItem.textContent);
    expect(menuItemTexts).toEqual([
      'K:Cross Chain Transfer Tracker',
      'K:Cross Chain Transfer Finisher',
      'K:Module explorer',
    ]); // Update the expected text values based on your menu configuration
  });
});
