import { MonoChevronLeft, MonoChevronRight } from '@kadena/react-icons/system';
import type { FC } from 'react';
import React from 'react';
import { Button } from '../Button';

interface IPageNavProps {
  label: string;
  direction?: 'prev' | 'next';
  isDisabled?: boolean;
  onClick: () => void;
}

export const PageNav: FC<IPageNavProps> = ({
  label,
  direction,
  isDisabled = false,
  onClick,
}) => {
  const isPrevious = direction === 'prev';
  const isNext = direction === 'next';

  return (
    <Button
      variant="transparent"
      isDisabled={isDisabled}
      onPress={onClick}
      startVisual={isPrevious ? <MonoChevronLeft /> : undefined}
      endVisual={isNext ? <MonoChevronRight /> : undefined}
    >
      {label}
    </Button>
  );
};
