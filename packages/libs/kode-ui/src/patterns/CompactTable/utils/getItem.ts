import type { ITableField } from '../LoadingSkeleton/types';

export interface IFieldCellProps {
  field: ITableField;
  item: any;
  isLoading?: boolean;
  isMobile?: boolean;
}

/**
 * returns the value of a prop in the given item
 * the key is a dot seperated string. like result.goodResult
 * it will try to find the
 * item {
 *  result: {
 *     goodResult: any
 *  }
 * }
 * @param item ITableField
 * @param key
 * @returns
 */
export const getItem = (
  item: IFieldCellProps['item'],
  key: string | [],
): any => {
  if (typeof key === 'string') {
    const keyArr = key.split('.');
    const value = keyArr.reduce((acc, val) => {
      if (!acc) return;
      const newItem = acc[val];
      if (newItem === undefined || newItem === null) return;

      return newItem;
    }, item);

    return value;
  }

  if (typeof key === 'object') {
    return key.map((k) => getItem(item, k));
  }
};
