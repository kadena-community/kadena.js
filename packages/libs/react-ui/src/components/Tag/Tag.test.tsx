import { Tag } from '@components/Tag';
import { render } from '@testing-library/react';
import React from 'react';

describe('Tag', () => {
  test('renders correctly', () => {
    const { getByTestId } = render(<Tag>Hello, Tag!</Tag>);

    const tagContainer = getByTestId('kda-tag');
    expect(tagContainer).toBeInTheDocument();
  });
});
