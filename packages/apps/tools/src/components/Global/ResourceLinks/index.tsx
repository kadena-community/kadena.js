import { MonoLink } from '@kadena/react-icons/system';
import useTranslation from 'next-translate/useTranslation';
import type { FC } from 'react';
import React from 'react';
import {
  linksClass,
  resourceLinksWrapperClass,
  titleTextClass,
  titleWrapperClass,
} from './styles.css';

interface ILinkProps {
  title: string;
  href: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
}
interface IProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  links: ILinkProps[];
}

export const ResourceLinks: FC<IProps> = ({ links, ...rest }: IProps) => {
  const { t } = useTranslation('common');
  return (
    <div className={resourceLinksWrapperClass} {...rest}>
      <div className={titleWrapperClass}>
        <span className={titleTextClass}>{t('Resource Links')}</span>
        <MonoLink />
      </div>
      <ul className={linksClass}>
        {links.map((link) => (
          <li key={link.title}>
            <a
              className={linksClass}
              href={link.href}
              target={link?.target ?? '_blank'}
            >
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResourceLinks;
