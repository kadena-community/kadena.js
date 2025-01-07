import type { ICSVAccount } from '@/services/batchRegisterIdentity';
import { checkAllowedFileTypes } from '@/utils/checkAllowedFileTypes';
import { csvFileToArray } from '@/utils/csvFileToArray';
import { objectNotValidSchema } from '@/utils/objectNotValidSchema';
import { Stack } from '@kadena/kode-ui';
import { useNotifications } from '@kadena/kode-ui/patterns';
import type { DragEventHandler, FC } from 'react';
import { useState } from 'react';
import { wrapperClass } from './style.css';

interface IProps {
  onResult: (values: []) => void;
  resultSchema: Record<string, string>;
}

export const DragNDropCSV: FC<IProps> = ({ onResult, resultSchema }) => {
  const [isHover, setIsHover] = useState(false);
  const { addNotification } = useNotifications();

  const handleDrop: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();

    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles);

      newFiles.filter(checkAllowedFileTypes).map((file: File) => {
        const fileReader = new FileReader();
        fileReader.readAsText(file);

        fileReader.onload = function () {
          const arr = csvFileToArray<ICSVAccount>(fileReader.result as string);

          if (!arr.find(objectNotValidSchema(resultSchema))) {
            addNotification({
              intent: 'negative',
              label: 'the CSV has the wrong schema',
              message: `Objects should adhere to the following schema: ${JSON.stringify(resultSchema, null, 2)}`,
            });
            onResult([]);
            return;
          }

          onResult(arr as any);
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
    </>
  );
};
