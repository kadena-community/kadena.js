import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '../'

test('Badge', () => {
  render(<Badge label="Test Label"/>)
  expect(screen.getAllByText('Test Label')).toBeDefined()
})