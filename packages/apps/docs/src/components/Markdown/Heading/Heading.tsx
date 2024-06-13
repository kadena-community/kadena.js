import { MonoLink } from '@kadena/react-icons';
import type { FC, ReactNode } from 'react';
import React, { useState } from 'react';
import { headerClassVariants, headerIconLinkClass } from './styles.css';

type TagType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
interface IProp {
  as: TagType;
  variant?: TagType;
  children: ReactNode;
  slug: string;
}

export interface IHeader {
  children: string;
  slug: string;
}

export const TaggedHeading: FC<IProp> = ({ children, as, variant, slug }) => {
  const outerSlug = `header${slug}`;
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    const elm = document.querySelector(slug) as HTMLElement;
    if (!elm) return;
    await navigator.clipboard.writeText(elm.innerText);
    setCopySuccess(true);
    setTimeout(() => {
      setCopySuccess(false);
    }, 3000);
  };

  const content = (
    <>
      {children}
      <a
        id={slug}
        className={headerIconLinkClass}
        href={`#${slug}`}
        aria-labelledby={outerSlug}
        onClick={handleCopy}
      >
        {copySuccess ? <MonoCheck /> : <MonoLink />}
      </a>
    </>
  );

  const headingVariant = headerClassVariants[variant ?? as];
  switch (as) {
    case 'h2':
      return (
        <h2 id={outerSlug} className={headingVariant}>
          {content}
        </h2>
      );
    case 'h3':
      return (
        <h3 id={outerSlug} className={headingVariant}>
          {content}
        </h3>
      );
    case 'h4':
      return (
        <h4 id={outerSlug} className={headingVariant}>
          {content}
        </h4>
      );
    case 'h5':
      return (
        <h5 id={outerSlug} className={headingVariant}>
          {content}
        </h5>
      );
    case 'h6':
      return (
        <h6 id={outerSlug} className={headingVariant}>
          {content}
        </h6>
      );
    case 'h1':
    default:
      return (
        <h1 id={outerSlug} className={headingVariant}>
          {content}
        </h1>
      );
  }
};
