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
  > {}

export const TagGroup: FC<ITagGroupProps> = (props) => {
  const { label } = props;
  const ref = React.useRef(null);

  const state = useListState(props);
  const { gridProps, labelProps } = useTagGroup(props, state, ref);

  return (
    <div className="tag-group">
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
