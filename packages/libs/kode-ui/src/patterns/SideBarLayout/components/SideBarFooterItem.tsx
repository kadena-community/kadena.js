import type { FC } from 'react';
import React from 'react';
import type { IButtonProps } from './../../../components';
import { Button } from './../../../components';

export type ISideBarFooterItemProps = Pick<
  IButtonProps,
  'startVisual' | 'aria-label' | 'onPress'
> & {
  render?: React.ReactElement;
};

export const SideBarFooterItem: FC<ISideBarFooterItemProps> = ({
  startVisual,
  render,
  ...props
}) => {
  if (render) return render;
  return <Button {...props} startVisual={startVisual} variant="transparent" />;
};
