import { Label } from '@components/Typography/Label/Label';
import type { FC } from 'react';
import React from 'react';
import type { AriaTagGroupProps } from 'react-aria';
import { useTagGroup } from 'react-aria';
import { useListState } from 'react-stately';
import { tagGroupLabelClass, tagListClass } from './Tag.css';
import { TagItem } from './TagItem';

export interface ITagGroupProps
  extends Omit<
    AriaTagGroupProps<object>,
    | 'description'
    | 'errorMessage'
    | 'selectionBehavior'
    | 'items'
    | 'selectionMode'
    | 'defaultSelectedKeys'
    | 'selectedKeys'
    | 'onSelectionChange'
  > {
  className?: string;
}

export const TagGroup: FC<ITagGroupProps> = ({ className, ...restProps }) => {
  const { label } = restProps;
  const ref = React.useRef(null);

  const state = useListState(restProps);
  const { gridProps, labelProps } = useTagGroup(restProps, state, ref);

  return (
    <div className={className}>
      {label && (
        <div {...labelProps}>
          {typeof label === 'string' ? (
            <Label className={tagGroupLabelClass}>{label}</Label>
          ) : (
            label
          )}
        </div>
      )}
      <div {...gridProps} ref={ref} className={tagListClass}>
        {[...state.collection].map((item) => (
          <TagItem key={item.key} item={item} state={state} />
        ))}
      </div>
    </div>
  );
};
