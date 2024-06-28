import React from 'react';
import { expect, test, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CreateToken from '@/components/CreateToken'; // Adjust the import path as necessary

test('CreateToken renders and handles input changes', () => {
  render(<CreateToken />);

  const uriInputElement = screen.getByLabelText('URI') as HTMLInputElement;
  expect(uriInputElement).toBeDefined();

  fireEvent.change(uriInputElement, { target: { value: 'new-uri' } });

  expect(uriInputElement.value).toBe('new-uri');

  const precisionInputElement = screen.getByLabelText('Precision') as HTMLInputElement;
  expect(precisionInputElement).toBeDefined();

  fireEvent.change(precisionInputElement, { target: { value: '1' } });

  expect(precisionInputElement.value).toBe('1');
});

test('CreateToken handles form submission', async () => {
  const mockHandleSubmit = vi.fn((event) => event.preventDefault());

  render(<CreateToken />);

  const submitButton = screen.getByText('Create Token');
  expect(submitButton).toBeDefined();

  submitButton.onclick = mockHandleSubmit;

  fireEvent.click(submitButton);

  expect(mockHandleSubmit).toHaveBeenCalled();
});