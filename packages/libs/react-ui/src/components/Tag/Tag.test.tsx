import { Tag } from './Tag';

import { render } from '@testing-library/react';
import React from 'react';

describe('Tag', () => {
  test('renders correctly', async () => {
    const { getByTestId } = render(<Tag>Hello, Tag!</Tag>);

    // Assert that the layout container element is rendered
    const tagContainer = await getByTestId('kda-tag');
    expect(tagContainer).toBeInTheDocument();
  });
});
