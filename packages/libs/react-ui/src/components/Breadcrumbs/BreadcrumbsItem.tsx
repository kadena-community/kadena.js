import { mergeRefs } from '@react-aria/utils';
import cn from 'classnames';
import type { FC } from 'react';
import React from 'react';
import type { AriaBreadcrumbItemProps } from 'react-aria';
import { useBreadcrumbItem } from 'react-aria';
import { itemClass, linkClass } from './Breadcrumbs.css';

export interface IBreadcrumbItemProps extends AriaBreadcrumbItemProps {
  href?: string;
  asChild?: boolean;
}

export const BreadcrumbsItem: FC<IBreadcrumbItemProps> = (props) => {
  const { href, isCurrent, isDisabled, asChild, children } = props;
  const ref = React.useRef(null);
  const { itemProps } = useBreadcrumbItem(props, ref);

  if (asChild && React.isValidElement(children)) {
    return (
      <li className={itemClass}>
        {React.cloneElement(children, {
          href,
          ...itemProps,
          ...children.props,
          className: cn(linkClass, children.props.className),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ref: mergeRefs(ref, (children as any).ref),
          'data-current': isCurrent,
          'data-disabled': isDisabled,
        })}
      </li>
    );
  }

  return (
    <li className={itemClass}>
      <a
        {...itemProps}
        className={linkClass}
        ref={ref}
        href={href}
        data-current={isCurrent}
        data-disabled={isDisabled}
      >
        {children}
      </a>
    </li>
  );
};
