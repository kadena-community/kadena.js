'use client';

import { TreeItem } from '@components/Tree/TreeItems';
import type { FC } from 'react';
import React, { useState } from 'react';

export interface ITreeProps {
  title?: React.ReactNode;
  items?: Omit<ITreeProps, 'linked'>[];
  isOpen?: boolean;
  linked?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export const Tree: FC<ITreeProps> = ({
  title,
  items,
  isOpen: initialIsOpen = false,
  linked = false,
  onOpen,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(Boolean(initialIsOpen));

  const handleOpen = (): void => {
    setIsOpen(true);
    onOpen?.();
  };
  const handleClose = (): void => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <TreeItem
      key={String(title)}
      title={title}
      items={items ?? []}
      isOpen={isOpen}
      onOpen={handleOpen}
      onClose={handleClose}
      linked={Boolean(linked)}
    />
  );
};
