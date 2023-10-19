import type {
  IsWrappedData,
  IWrappedData,
  UnwrappedObjects,
} from '../dataWrapper';
import { isWrappedData, wrapData } from '../dataWrapper';
import type { UnionToIntersection } from '../typeUtilities';
import { oneOf } from './oneOf';
import type { IParser, RuleReturnType } from './rule';
import { FAILED, rule } from './rule';

type MakeArr<Type> = {
  [Property in keyof Type]: Type[Property][];
};

interface IRepeat {
  <T extends Array<IParser>>(
    ...parsers: T
  ): IParser<
    IWrappedData<
      Partial<
        UnionToIntersection<
          MakeArr<UnwrappedObjects<IsWrappedData<RuleReturnType<T[number]>>>>
        >
      >,
      undefined
    >,
    never
  >;
}

/**
 * should be always the last parser in the block
 */
export const repeat: IRepeat = (...parsers) => {
  const oneOfParser = oneOf(...parsers);
  return rule((pointer) => {
    const results: IWrappedData[] = [];
    while (!pointer.done()) {
      const result = oneOfParser(pointer);
      if (result === FAILED) {
        break;
      }
      if (isWrappedData(result)) {
        results.push(result);
      }
    }

    const pushUnique = <T>(arr: T[] = [], item: T): T[] => {
      if (!arr.includes(item)) {
        arr.push(item);
      }
      return arr;
    };

    // flat the array as an object
    const returnValue = results.reduce((acc, item) => {
      const name = item.name;
      if (name !== undefined && name) {
        acc[name] = pushUnique(acc[name], item.data);
      } else {
        if (typeof item.data === 'object') {
          const keys = Object.keys(item.data);
          keys.forEach((key) => {
            acc[key] = pushUnique(acc[key], item.data[key]);
          });
        } else if (item.data !== undefined) {
          acc['not-categorized'] = pushUnique(
            acc['not-categorized'],
            item.data,
          );
        }
      }

      return acc;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {} as any);

    return wrapData(returnValue);
  });
};
