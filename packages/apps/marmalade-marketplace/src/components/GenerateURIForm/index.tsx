import React, { FC, useRef } from 'react';
import { TextField, Heading } from '@kadena/kode-ui';
import * as styles from '@/styles/create-token.css';

interface GenerateURIProps {
  tokenInput: { [key: string]: string | number | object };
  handleTokenInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  file: File | null;
  setFile: (file: File) => void;
  imagePreview: string;
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
    <div className={styles.tokenImageWrapper}
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
        onClick={() => inputFile.current?.click()}
      >
        <input
          type="file"
          id="fileInput"
          ref={inputFile}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <img className={styles.tokenImageClass} src={imagePreview} alt="Uploaded Preview" />
      </div>
  );
};

export default GenerateURIForm;
