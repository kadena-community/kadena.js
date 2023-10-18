import { Stack } from '@components/Stack';
import { render } from '@testing-library/react';
import React from 'react';
import { itemClass } from './stories.css';

describe('Stack', () => {
  test('renders correctly', () => {
    const { getByTestId } = render(
      <Stack>
        <div className={itemClass}>Item 1</div>
        <div className={itemClass}>Item 2</div>
        <div className={itemClass}>Item 3</div>
        <div className={itemClass}>Item 4</div>
        <div className={itemClass}>Item 5</div>
        <div className={itemClass}>Item 6</div>
      </Stack>,
    );

    const stackContainer = getByTestId('kda-stack');
    expect(stackContainer).toBeInTheDocument();
  });
});
