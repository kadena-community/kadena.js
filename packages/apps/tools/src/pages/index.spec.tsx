jest.mock('@/pages/home', () => jest.fn(() => <div>Home Component</div>));
import Index from '@/pages/index';
import { render } from '@testing-library/react';
import React from 'react';

describe('Index Page', () => {
  it('renders the Home component', () => {
    const { getByText } = render(<Index />);
    expect(getByText('Home Component')).toBeInTheDocument();
  });
});
