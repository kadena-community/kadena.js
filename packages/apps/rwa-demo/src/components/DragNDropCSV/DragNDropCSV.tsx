import { checkAllowedFileTypes } from '@/utils/checkAllowedFileTypes';
import { csvFileToArray } from '@/utils/csvFileToArray';
import { Stack } from '@kadena/kode-ui';
import { CompactTable, CompactTableFormatters } from '@kadena/kode-ui/patterns';
import type { DragEventHandler } from 'react';
import { useState } from 'react';
import { wrapperClass } from './style.css';

export interface ICSVAccount {
  account: string;
  alias: string;
}

export const DragNDropCSV = () => {
  const [accounts, setAccounts] = useState<ICSVAccount[]>([]);
  const [isHover, setIsHover] = useState(false);

  const handleDrop: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();

    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles);

      newFiles.filter(checkAllowedFileTypes).map((file: File) => {
        const fileReader = new FileReader();
        fileReader.readAsText(file);

        fileReader.onload = function () {
          setAccounts(csvFileToArray<ICSVAccount>(fileReader.result as string));
        };

        fileReader.onerror = function () {
          console.log(fileReader.error);
        };
      });
    }
  };

  const handleHover: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setIsHover(true);
  };

  const handleHoverOut: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setIsHover(false);
  };

  return (
    <>
      <Stack
        width="100%"
        className={wrapperClass({ isHover })}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={handleHover}
        onDragLeave={handleHoverOut}
        justifyContent="center"
        alignItems="center"
      >
        Drop CSV file header
      </Stack>

      <CompactTable
        fields={[
          {
            key: 'select',
            label: '',
            width: '20%',
            render: CompactTableFormatters.FormatCheckbox({ name: 'select' }),
          },
          {
            key: 'account',
            label: 'Account',
            width: '40%',
            render: CompactTableFormatters.FormatAccount(),
          },
          { key: 'alias', label: 'Alias', width: '40%' },
        ]}
        data={accounts}
      />
    </>
  );
};
