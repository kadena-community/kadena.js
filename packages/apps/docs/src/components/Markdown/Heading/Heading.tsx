import { SystemIcon } from '@kadena/react-ui';

import {
  headerIconLink,
  headerIconLinkHovered,
  headerVariants,
} from './styles.css';

import { createSlug } from '@/utils';
import React, { FC, useState } from 'react';

type TagType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
interface IProp {
  as: TagType;
  variant?: TagType;
  children: string;
  index?: number;
  parentTitle?: string;
}

export interface IHeader {
  children: string;
}

export const TaggedHeading: FC<IProp> = ({
  children,
  as,
  variant,
  index,
  parentTitle,
}) => {
  const slug = createSlug(children, index, parentTitle);

  // vanilla-extract doesn't support styling subcomponents
  // globalStyle doesn't support simple pseudo selectors
  // only way around the hover behavior is via state + variants
  const [linkHoverVariant, setLinkHoverVariant] = useState<boolean>(false);

  const onMouseOver = (): void => {
    setLinkHoverVariant(true);
  };

  const onMouseLeave = (): void => {
    setLinkHoverVariant(false);
  };

  const ArticleLink = (
    <a
      className={linkHoverVariant ? headerIconLinkHovered : headerIconLink}
      id={slug}
      href={`#${slug}`}
    >
      <SystemIcon.Link />
    </a>
  );
  switch (as) {
    case 'h2':
      return (
        <h2
          onMouseLeave={onMouseLeave}
          onMouseOver={onMouseOver}
          onFocus={() => {}}
          className={headerVariants[variant ?? as]}
        >
          {children}
          {ArticleLink}
        </h2>
      );
    case 'h3':
      return (
        <h3
          onMouseLeave={onMouseLeave}
          onMouseOver={onMouseOver}
          onFocus={() => {}}
          className={headerVariants[variant ?? as]}
        >
          {children}
          {ArticleLink}
        </h3>
      );
    case 'h4':
      return (
        <h4
          onMouseLeave={onMouseLeave}
          onMouseOver={onMouseOver}
          onFocus={() => {}}
          className={headerVariants[variant ?? as]}
        >
          {children}
          {ArticleLink}
        </h4>
      );
    case 'h5':
      return (
        <h5
          onMouseLeave={onMouseLeave}
          onMouseOver={onMouseOver}
          onFocus={() => {}}
          className={headerVariants[variant ?? as]}
        >
          {children}
          {ArticleLink}
        </h5>
      );
    case 'h6':
      return (
        <h6
          onMouseLeave={onMouseLeave}
          onMouseOver={onMouseOver}
          onFocus={() => {}}
          className={headerVariants[variant ?? as]}
        >
          {children}
          {ArticleLink}
        </h6>
      );
    case 'h1':
    default:
      return (
        <h1
          onMouseLeave={onMouseLeave}
          onMouseOver={onMouseOver}
          onFocus={() => {}}
          className={headerVariants[variant ?? as]}
        >
          {children}
          {ArticleLink}
        </h1>
      );
  }
};
