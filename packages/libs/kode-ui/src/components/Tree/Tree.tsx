'use client';
import type { FC } from 'react';
import React, { useState } from 'react';
import { TreeItem } from '../Tree/TreeItems';

export interface ITreeProps {
  title?: React.ReactNode;
  items?: Omit<ITreeProps, 'linked'>[];
  isOpen?: boolean;
  linked?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

/**
 * A component used for grouping items in a tree.
 * @deprecated This component will be redesigned.
 */
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
