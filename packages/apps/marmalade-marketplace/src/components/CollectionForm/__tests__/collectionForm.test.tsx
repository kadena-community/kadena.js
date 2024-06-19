import React from 'react';
import { expect, test, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CollectionForm from '@/components/CollectionForm'; // Adjust the import path as necessary

test('CollectionForm renders and handles input changes', () => {
  const mockHandleCollectionInputChange = vi.fn();
  const collectionInput = { collectionId: '123' };

  render(
    <CollectionForm
      collectionInput={collectionInput}
      handleCollectionInputChange={mockHandleCollectionInputChange}
    />
  );

  const inputElement = screen.getByLabelText('Collection ID') as HTMLInputElement;
  expect(inputElement).toBeDefined();
  expect(inputElement.value).toBe('123');

  fireEvent.change(inputElement, { target: { value: '456' } });

  expect(mockHandleCollectionInputChange).toHaveBeenCalled();
});