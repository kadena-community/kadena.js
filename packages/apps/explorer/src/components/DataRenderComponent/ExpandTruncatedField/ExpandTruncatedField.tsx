import { CopyButton } from '@/components/CopyButton/CopyButton';
import { Stack, Text } from '@kadena/kode-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import React, { useState } from 'react';
import {
  descriptionDetailsClass,
  descriptionDetailsExpandedClass,
  textClass,
  textCopyClass,
} from '../DataRenderComponentVertical/styles.css';

interface IProps {
  field: IDataRenderComponentField;
}

export const ExpandTruncatedField: FC<IProps> = ({ field }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Stack
      onClick={() => setIsExpanded(true)}
      as="dd"
      gap="xs"
      className={classNames(descriptionDetailsClass, {
        [descriptionDetailsExpandedClass]: isExpanded,
      })}
      alignItems="center"
    >
      <Text
        variant="code"
        className={classNames(textClass, {
          [textCopyClass]: field.canCopy,
        })}
      >
        <span id="requestkey">{field.value}</span>
      </Text>
      {field.canCopy && <CopyButton id="requestkey" />}
    </Stack>
  );
};
