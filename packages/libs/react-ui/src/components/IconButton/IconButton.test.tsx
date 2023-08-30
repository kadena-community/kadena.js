import { IconButton } from '@components/IconButton';
import { render } from '@testing-library/react';
import React from 'react';

describe('IconButton', () => {
  test('renders correctly', () => {
    const { getByTestId } = render(
      <IconButton title="icon-button" icon="Account" />,
    );

    const iconButton = getByTestId('kda-icon-button');
    expect(iconButton).toBeInTheDocument();
  });
});
