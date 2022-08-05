import React, { ChangeEvent, FC, memo, useCallback } from 'react';
import s from './ButtonsComponent.module.css';

interface IProps {
  onChange: (e: ChangeEvent) => void;
  onBlur?: (e: ChangeEvent) => void;
  onGenerateKeys?: () => void;
  onSelectFile?: (file: File) => void;
  fileValue: string;
}

const ButtonsComponent: FC<IProps> = ({
  onChange,
  onBlur,
  fileValue,
  // onGenerate,
  onSelectFile,
  onGenerateKeys,
}) => {
  const onChangeFile = useCallback(
    event => {
      if (event.currentTarget.files) {
        const uploadFile = event.currentTarget.files[0];
        if (uploadFile && onSelectFile) {
          onSelectFile(uploadFile);
        }
        onChange(event);
      }
    },
    [onChange, onSelectFile],
  );
  return (
    <div className={s.buttonGroup}>
      <div className={s.picture}>
        <label className={s.pictureButton}>
          Upload File
          <input
            type="file"
            name="keyFile"
            spellCheck={false}
            onChange={onChangeFile}
            onBlur={onBlur}
            value={fileValue}
          />
        </label>
        <span className={s.chooseFile}>{fileValue || 'No file selected'}</span>
      </div>
      <div className={s.submit}>
        <button
          onClick={onGenerateKeys}
          type="submit"
          className={s.submitButton}>
          Generate keys
        </button>
      </div>
    </div>
  );
};

export default memo(ButtonsComponent);
