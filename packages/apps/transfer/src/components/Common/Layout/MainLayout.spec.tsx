jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    pathname: '/transfer',
  })),
}));

import MainLayout from './MainLayout';

import { render } from '@testing-library/react';
// @ts-ignore
import React from 'react';

describe('MainLayout', () => {
  test('renders correctly', () => {
    const { getByTestId } = render(
      <MainLayout title="My Title">Content</MainLayout>,
    );

    // Assert that the title is rendered
    const titleElement = getByTestId('title');
    expect(titleElement).toBeInTheDocument();

    // Assert that the content is rendered
    const contentElement = getByTestId('content');
    expect(contentElement).toBeInTheDocument();

    // Assert that the Back link is rendered
    const backButton = getByTestId('back-button');
    expect(backButton).toBeInTheDocument();
  });
});
