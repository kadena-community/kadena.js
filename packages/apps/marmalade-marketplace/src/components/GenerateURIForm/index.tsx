import React, { FC, useRef } from 'react';
import { TextField, Heading } from '@kadena/kode-ui';
import * as styles from '@/styles/create-token.css';

interface GenerateURIProps {
  tokenInput: { [key: string]: string | number | object };
  handleTokenInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  file: File | null;
  setFile: (file: File) => void;
  imagePreview: string | null;
  setImagePreview: (url: string) => void;
  base64Image: string;
  setBase64Image: (base64: string) => void;
  setError: (error: string) => void;
}

const GenerateURIForm: FC<GenerateURIProps> = ({
  tokenInput,
  handleTokenInputChange,
  file,
  setFile,
  imagePreview,
  setImagePreview,
  setError
}) => {
  const inputFile = useRef<HTMLInputElement | null>(null);

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    try {
      const dataTransfer = event.dataTransfer;
      if (dataTransfer && dataTransfer.files) {
        const file = dataTransfer.files[0];
        setFile(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        throw new Error("No files selected");
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target && e.target.files) {
        const file = e.target.files[0];
        setFile(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        throw new Error("No files selected");
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className={styles.twoColumnRow}>
      <div className={styles.uploadContainer}>
        <div
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
          onClick={() => inputFile.current?.click()}
          style={{ width: '100%' }}
        >
          <input
            type="file"
            id="fileInput"
            ref={inputFile}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          {imagePreview ? (
            <img src={imagePreview} alt="Uploaded Preview" className={styles.uploadImage} />
          ) : (
            <div>
              <p className={styles.uploadText}>Upload Image</p>
              <p className={styles.uploadText}>Drag/Drop or Select</p>
            </div>
          )}
        </div>
      </div>
      <div className={styles.formSection}>
        <div className={styles.verticalForm}>
          <Heading as="h5" className={styles.formHeading}>Metadata</Heading>
          <br />
          <TextField
            label="Name"
            name="metadataName"
            value={tokenInput.metadataName as string}
            onChange={handleTokenInputChange}
          />
          <TextField
            label="Description"
            name="metadataDescription"
            value={tokenInput.metadataDescription as string}
            onChange={handleTokenInputChange}
          />
          <TextField
            label="Author"
            name="metadataAuthors"
            value={tokenInput.metadataAuthors as string}
            onChange={handleTokenInputChange}
            info="(optional)"
          />
          <TextField
            label="Collection Name"
            name="metadataCollectionName"
            value={tokenInput.metadataCollectionName as string}
            onChange={handleTokenInputChange}
            info="(optional)"
          />
          <TextField
            label="Collection Family"
            name="metadataCollectionFamily"
            value={tokenInput.metadataCollectionFamily as string}
            onChange={handleTokenInputChange}
            info="(optional)"
          />
        </div>
      </div>
    </div>
  );
};

export default GenerateURIForm;
