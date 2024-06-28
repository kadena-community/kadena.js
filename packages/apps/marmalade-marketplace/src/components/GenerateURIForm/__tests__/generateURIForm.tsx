import React from 'react';
import { expect, test, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GenerateURIForm from '@/components/GenerateURIForm'; // Adjust the import path as necessary

const mockSetFile = vi.fn();
const mockSetImagePreview = vi.fn();
const mockHandleTokenInputChange = vi.fn();
const mockSetError = vi.fn();

const tokenInput = {
  metadataName: '',
  metadataDescription: '',
  metadataAuthors: '',
  metadataCollectionName: '',
  metadataCollectionFamily: '',
};

const file = null;
const imagePreview = null;
const base64Image = '';

test('GenerateURIForm renders and handles input changes', () => {
  render(
    <GenerateURIForm
      tokenInput={tokenInput}
      handleTokenInputChange={mockHandleTokenInputChange}
      file={file}
      setFile={mockSetFile}
      imagePreview={imagePreview}
      setImagePreview={mockSetImagePreview}
      base64Image={base64Image}
      setBase64Image={vi.fn()}
      setError={mockSetError}
    />
  );

  const nameInputElement = screen.getByLabelText('Name');
  const descriptionInputElement = screen.getByLabelText('Description');
  const authorInputElement = screen.getByLabelText('Author');
  const collectionNameInputElement = screen.getByLabelText('Collection Name');
  const collectionFamilyInputElement = screen.getByLabelText('Collection Family');

  expect(nameInputElement).toBeInTheDocument();
  expect(descriptionInputElement).toBeInTheDocument();
  expect(authorInputElement).toBeInTheDocument();
  expect(collectionNameInputElement).toBeInTheDocument();
  expect(collectionFamilyInputElement).toBeInTheDocument();

  fireEvent.change(nameInputElement, { target: { value: 'New Name' } });
  fireEvent.change(descriptionInputElement, { target: { value: 'New Description' } });
  fireEvent.change(authorInputElement, { target: { value: 'New Author' } });
  fireEvent.change(collectionNameInputElement, { target: { value: 'New Collection Name' } });
  fireEvent.change(collectionFamilyInputElement, { target: { value: 'New Collection Family' } });

  expect(mockHandleTokenInputChange).toHaveBeenCalledTimes(5);
});

test('GenerateURIForm handles file drop', () => {
  render(
    <GenerateURIForm
      tokenInput={tokenInput}
      handleTokenInputChange={mockHandleTokenInputChange}
      file={file}
      setFile={mockSetFile}
      imagePreview={imagePreview}
      setImagePreview={mockSetImagePreview}
      base64Image={base64Image}
      setBase64Image={vi.fn()}
      setError={mockSetError}
    />
  );

  const fileDropZone = screen.getByText('Upload Image');

  const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);

  fireEvent.drop(fileDropZone, {
    dataTransfer,
  });

  expect(mockSetFile).toHaveBeenCalledWith(file);
  expect(mockSetImagePreview).toHaveBeenCalled();
});

test('GenerateURIForm handles file change', () => {
  render(
    <GenerateURIForm
      tokenInput={tokenInput}
      handleTokenInputChange={mockHandleTokenInputChange}
      file={file}
      setFile={mockSetFile}
      imagePreview={imagePreview}
      setImagePreview={mockSetImagePreview}
      base64Image={base64Image}
      setBase64Image={vi.fn()}
      setError={mockSetError}
    />
  );

  const fileInputElement = screen.getByLabelText('Upload Image');

  const file = new File(['dummy content'], 'example.png', { type: 'image/png' });

  fireEvent.change(fileInputElement, {
    target: { files: [file] },
  });

  expect(mockSetFile).toHaveBeenCalledWith(file);
  expect(mockSetImagePreview).toHaveBeenCalled();
});
