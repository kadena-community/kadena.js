import Index from '@/pages/index';
import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

describe('Index Page', () => {
  it('renders the Home component', () => {
    const { getByText } = render(<Index />);
    expect(getByText('Kadena Tools')).toBeInTheDocument();
  });
});
