import React, { FC, useRef } from 'react';
import { Button } from '@kadena/kode-ui';
import { MonoPermMedia, MonoUploadFile } from '@kadena/kode-icons';
import * as styles from './style.css';

interface GenerateURIProps {
  tokenInput: { [key: string]: string | number | object };
  handleTokenInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  file: File | null;
  setFile: (file: File) => void;
  imagePreview?: string;
  setImagePreview: (url: string) => void;
  base64Image: string;
  setBase64Image: (base64: string) => void;
  setError: (error: string) => void;
}

const GenerateURIForm: FC<GenerateURIProps> = ({
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

  const handleFileClick = () => {
    inputFile.current?.click();
  };

  return (
    <>
    <div className={styles.tokenImageContainer}>
      <div
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
        onClick={handleFileClick}
      >
        <input
          type="file"
          id="fileInput"
          ref={inputFile}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        {imagePreview
          ? <img src={imagePreview} alt="Uploaded Preview" />
          : <div className={styles.uploadContainer}><MonoPermMedia className={styles.uploadIcon} /></div>}
      </div>
    </div>
    <Button
        startVisual={<MonoUploadFile />}
        onPress={handleFileClick}
        variant="outlined"
        style={{ marginBottom: '50px' }}
      >
        Select File
      </Button>
    </>
  );
};

export default GenerateURIForm;
