import { Tag } from '@components/Tag';
import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, test } from 'vitest';

describe('Tag', () => {
  test('renders correctly', () => {
    const { getByTestId } = render(<Tag>Hello, Tag!</Tag>);

    const tagContainer = getByTestId('kda-tag');
    expect(tagContainer).toBeInTheDocument();
  });
});
