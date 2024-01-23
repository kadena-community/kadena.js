import type { FC } from 'react';
import type { INavAccordionRootProps } from './NavAccordion';
import { NavAccordionRoot } from './NavAccordion';
import type { INavAccordionGroupProps } from './NavAccordionGroup';
import { NavAccordionGroup } from './NavAccordionGroup';
import type { INavAccordionLinkProps } from './NavAccordionLink';
import { NavAccordionLink } from './NavAccordionLink';
import type { INavAccordionSectionProps } from './NavAccordionSection';
import { NavAccordionSection } from './NavAccordionSection';

export {
  INavAccordionGroupProps,
  INavAccordionLinkProps,
  INavAccordionRootProps,
  INavAccordionSectionProps,
};

export interface INavAccordionProps {
  Root: FC<INavAccordionRootProps>;
  Section: FC<INavAccordionSectionProps>;
  Group: FC<INavAccordionGroupProps>;
  Link: FC<INavAccordionLinkProps>;
}

/**
 * A component used for grouping items in a navigation accordion.
 * @deprecated This component will be redesigned.
 */
export const NavAccordion: INavAccordionProps = {
  Root: NavAccordionRoot,
  Section: NavAccordionSection,
  Group: NavAccordionGroup,
  Link: NavAccordionLink,
};
