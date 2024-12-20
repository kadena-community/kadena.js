import React from 'react';
import { Box, Notification } from '@kadena/kode-ui';
import classNames from 'classnames';
import { codeArea } from './style.css'; // Use your existing style

interface TransactionInputAreaProps {
  input: string;
  error?: string;
  onChange: (val: string) => void;
}

export const TransactionInputArea: React.FC<TransactionInputAreaProps> = ({
  input,
  error,
  onChange,
}) => {
  return (
    <Box>
      <textarea
        value={input}
        className={classNames(codeArea)}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && (
        <Notification intent="negative" role="alert">
          {error}
        </Notification>
      )}
    </Box>
  );
};
