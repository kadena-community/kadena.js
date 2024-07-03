import CopyButton from '@/components/copy-button/copy-button';
import { Stack, Text } from '@kadena/kode-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import {
  descriptionDetailsClass,
  descriptionDetailsExpandedClass,
  textClass,
  textCopyClass,
} from '../data-render-component-vertical/styles.css';

interface IProps {
  field: IDataRenderComponentField;
}

const storageKey = 'expandedfields';

const ExpandTruncatedField: FC<IProps> = ({ field }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = (): void => {
    let storage: string[] = JSON.parse(
      localStorage.getItem(storageKey) ?? '[]',
    );

    const key = field.key ? field.key : field.id ?? '';

    if (isExpanded) {
      storage = storage.filter((v) => v !== key);
    } else {
      storage.push(key);
    }

    localStorage.setItem(storageKey, JSON.stringify(storage));

    window.dispatchEvent(new Event(storageKey));
    setIsExpanded((v) => !isExpanded);
  };

  const checkStorage = () => {
    const storage: string[] = JSON.parse(
      localStorage.getItem(storageKey) ?? '[]',
    );

    setIsExpanded(storage.includes(field.key));
  };
  const storageListener = useCallback((event: StorageEvent | Event) => {
    if (event.type !== storageKey && 'key' in event && event.key !== storageKey)
      return;

    checkStorage();
  }, []);

  useEffect(() => {
    checkStorage();
    window.addEventListener(storageKey, storageListener);
    window.addEventListener('storage', storageListener);
    return () => {
      window.removeEventListener(storageKey, storageListener);
      window.removeEventListener('storage', storageListener);
    };
  }, [storageListener]);

  return (
    <Stack
      onClick={toggleExpand}
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

export default ExpandTruncatedField;
