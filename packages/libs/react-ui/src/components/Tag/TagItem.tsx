import { SystemIcon } from '@components/Icon';
import type { FC } from 'react';
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
      <SystemIcon.Close size="sm" />
    </button>
  );
};

interface ITagItemProps extends AriaTagProps<object> {
  state: ListState<object>;
}

export const TagItem: FC<ITagItemProps> = (props) => {
  const { item, state } = props;
  const ref = React.useRef(null);
  const { focusProps, isFocusVisible } = useFocusRing({ within: true });
  const { rowProps, gridCellProps, removeButtonProps, allowsRemoving } = useTag(
    props,
    state,
    ref,
  );

  return (
    <div
      className={tagItemClass}
      ref={ref}
      {...rowProps}
      {...focusProps}
      data-focus-visible={isFocusVisible}
    >
      <Tag {...gridCellProps}>
        {item.rendered}
        {allowsRemoving && <CloseButton {...removeButtonProps} />}
      </Tag>
    </div>
  );
};
