import { MonoClose } from '@kadena/kode-icons/system';
import { mergeRefs } from '@react-aria/utils';
import type { FC, ReactNode } from 'react';
import React from 'react';
import type { AriaButtonOptions, AriaTagProps } from 'react-aria';
import { useButton, useFocusRing, useTag } from 'react-aria';
import type { ListState } from 'react-stately';
import { Tag } from './Tag';
import { closeButtonClass, tagItemClass } from './Tag.css';

const CloseButton: FC<AriaButtonOptions<'button'>> = (props) => {
  const ref = React.useRef(null);
  const { buttonProps } = useButton(props, ref);

  return (
    <button className={closeButtonClass} {...buttonProps} ref={ref}>
      <MonoClose />
    </button>
  );
};

interface IInternalTagItemProps extends AriaTagProps<object> {
  state: ListState<object>;
  children?: React.ReactNode;
  asChild?: boolean;
}

/**
 * @private
 */
export const InternalTagItem: FC<IInternalTagItemProps> = ({
  children,
  asChild,
  ...props
}) => {
  const { state } = props;
  const ref = React.useRef(null);
  const { focusProps, isFocusVisible } = useFocusRing({ within: true });
  const { rowProps, gridCellProps, removeButtonProps, allowsRemoving } = useTag(
    props,
    state,
    ref,
  );

  const getContent = (content: ReactNode): ReactNode => (
    <Tag {...gridCellProps}>
      {content}
      {allowsRemoving && <CloseButton {...removeButtonProps} />}
    </Tag>
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: tagItemClass,
      ...children.props,
      ...rowProps,
      ...focusProps,
      'data-focus-visible': isFocusVisible,
      ref: mergeRefs(ref, (children as any).ref),
      children: getContent(children.props.children),
    });
  }

  return (
    <div
      className={tagItemClass}
      ref={ref}
      {...rowProps}
      {...focusProps}
      data-focus-visible={isFocusVisible}
    >
      {getContent(children)}
    </div>
  );
};
