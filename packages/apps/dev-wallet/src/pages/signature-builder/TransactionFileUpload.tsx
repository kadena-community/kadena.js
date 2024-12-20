import { browse, readContent } from '@/utils/select-file';
import { Box, Button } from '@kadena/kode-ui';
import yaml from 'js-yaml';
import React from 'react';

interface TransactionFileUploadProps {
  onError: (message?: string) => void;
  onProcess: (data: string) => void;
}

export const TransactionFileUpload: React.FC<TransactionFileUploadProps> = ({
  onError,
  onProcess,
}) => {
  const handleFile = async () => {
    onError(undefined);
    const files = await browse(true);
    if (files && files instanceof FileList) {
      await Promise.all(
        Array.from(files).map(async (file) => {
          const content = await readContent(file);
          try {
            // Attempt to load as YAML (which can also parse valid JSON)
            yaml.load(content);

            // If successful, we pass the raw content along for processing
            onProcess(content);
          } catch (e) {
            onError('Invalid file format, unable to parse as YAML/JSON');
          }
        }),
      );
    }
  };

  return (
    <Box>
      <Button variant="outlined" onClick={handleFile}>
        Add From File(s)
      </Button>
    </Box>
  );
};
