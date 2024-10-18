import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { Badge } from '../';

test('Badge', () => {
  render(<Badge label="Test Label" />);
  expect(screen.getAllByText('Test Label')).toBeDefined();
});
