import React, { FC } from 'react';
import { Text } from "@kadena/kode-ui";
import * as styles from './style.css';

interface LabeledTextProps {
    label: string;
    value: string;
}

const LabeledText: FC<LabeledTextProps>  = ({ label, value }) => {
  return (
      <div className={styles.labelValueContainer}>
        <div className={styles.labelTitle}>
          <Text as="p" size='small' variant='ui'>{label}</Text>
        </div>
        <div className={styles.labelValue}>
          <Text as="p" size='base' variant='ui' color='emphasize'>{value}</Text>
        </div>
      </div>
  );
}

export default LabeledText;