import React from 'react';
import { expect, test, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CreateToken from '@/components/CreateToken'; // Adjust the import path as necessary

test('CreateToken renders token information form', () => {
  render(<CreateToken />);

  const uriInputElement = screen.getByLabelText('URI');
  const precisionInputElement = screen.getByLabelText('Precision');
  const chainIdSelectElement = screen.getByLabelText('Chain ID');

  expect(uriInputElement).toBeInTheDocument();
  expect(precisionInputElement).toBeInTheDocument();
  expect(chainIdSelectElement).toBeInTheDocument();
});

test('CreateToken handles URI input change', () => {
  render(<CreateToken />);

  const uriInputElement = screen.getByLabelText('URI') as HTMLInputElement;

  fireEvent.change(uriInputElement, { target: { value: 'new-uri' } });

  expect(uriInputElement.value).toBe('new-uri');
});

test('CreateToken handles precision input change', () => {
  render(<CreateToken />);

  const precisionInputElement = screen.getByLabelText('Precision') as HTMLInputElement;

  fireEvent.change(precisionInputElement, { target: { value: '1' } });

  expect(precisionInputElement.value).toBe('1');
});

test('CreateToken toggles URI input', () => {
  render(<CreateToken />);

  const uriInputElement = screen.getByLabelText('URI') as HTMLInputElement;
  const checkboxElement = screen.getByLabelText("Don't have URI") as HTMLInputElement;

  expect(uriInputElement.disabled).toBe(false);

  fireEvent.click(checkboxElement);

  expect(uriInputElement.disabled).toBe(true);
});

test('CreateToken handles form submission', async () => {
  const mockHandleSubmit = vi.fn((event) => event.preventDefault());

  render(<CreateToken />);

  const submitButton = screen.getByText('Create Token');
  expect(submitButton).toBeInTheDocument();

  submitButton.onclick = mockHandleSubmit;

  fireEvent.click(submitButton);

  expect(mockHandleSubmit).toHaveBeenCalled();
});

test('CreateToken displays error on submission failure', async () => {
  const mockHandleSubmit = vi.fn((event) => {
    event.preventDefault();
    throw new Error('Submission error');
  });

  render(<CreateToken />);

  const submitButton = screen.getByText('Create Token');
  expect(submitButton).toBeInTheDocument();

  submitButton.onclick = mockHandleSubmit;

  fireEvent.click(submitButton);

  const errorBox = await screen.findByText('Error: Submission error');
  expect(errorBox).toBeInTheDocument();
});

test('CreateToken handles guarded policy tab interactions', () => {
  render(<CreateToken />);

  const guardedCheckbox = screen.getByLabelText('Guarded') as HTMLInputElement;
  fireEvent.click(guardedCheckbox);

  const guardFormTab = screen.getByText('Guards');
  expect(guardFormTab).toBeInTheDocument();

  fireEvent.click(guardFormTab);

  const guardFormContent = screen.getByLabelText('URI Guard');
  expect(guardFormContent).toBeInTheDocument();
});

test('CreateToken handles royalty policy tab interactions', () => {
  render(<CreateToken />);

  const royaltyCheckbox = screen.getByLabelText('Has Royalty') as HTMLInputElement;
  fireEvent.click(royaltyCheckbox);

  const royaltyFormTab = screen.getByText('Royalty');
  expect(royaltyFormTab).toBeInTheDocument();

  fireEvent.click(royaltyFormTab);

  const royaltyFormContent = screen.getByLabelText('Royalty Rate');
  expect(royaltyFormContent).toBeInTheDocument();
});

test('CreateToken handles collection policy tab interactions', () => {
  render(<CreateToken />);

  const collectionCheckbox = screen.getByLabelText('Collection') as HTMLInputElement;
  fireEvent.click(collectionCheckbox);

  const collectionFormTab = screen.getByText('Collection');
  expect(collectionFormTab).toBeInTheDocument();

  fireEvent.click(collectionFormTab);

  const collectionFormContent = screen.getByLabelText('Collection ID');
  expect(collectionFormContent).toBeInTheDocument();
});
