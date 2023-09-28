import type { FC } from 'react';
import React from 'react';

export interface INavAccordionLinkProps {
  children?: string;
}

export const NavAccordionLink: FC<INavAccordionLinkProps> = ({ children }) => {
  return <li>{children}</li>;
};
