import type { ITableField } from '@/components/LoadingSkeleton/types';

export interface IFieldCellProps {
  field: ITableField;
  item: any;
  isLoading?: boolean;
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
  key: ITableField['key'],
) => {
  const keyArr = key.split('.');
  const value = keyArr.reduce((acc, val) => {
    if (!acc) return;
    const newItem = acc[val];
    if (newItem === undefined || newItem === null) return;

    return newItem;
  }, item);

  return value;
};
