'use client';
import Arweave from 'arweave';
import type { FC } from 'react';
import { FileUploader as Uploader } from 'react-drag-drop-files';

interface IProps {
  onChange: (file: IFile) => void;
}

const arweave = Arweave.init({});
console.log(arweave);

export const FileUploader: FC<IProps> = ({ onChange }) => {
  return (
    <Uploader
      multiple={false}
      handleChange={onChange}
      name="file"
      types={['JPEG', 'PNG', 'GIF']}
    />
  );
};
