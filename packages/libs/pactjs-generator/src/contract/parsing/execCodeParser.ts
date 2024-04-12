import { unwrapData } from './utils/dataWrapper';
import { functionCallParser } from './utils/functionCallParser';
import { getPointer } from './utils/getPointer';
import { FAILED } from './utils/parser-utilities';

/**
 * @alpha
 */
export interface IParsedCode {
  function: {
    module?: string;
    namespace?: string;
    name: string;
  };
  args: Array<
    | { string: string }
    | { int: number }
    | { decimal: number }
    | {
        object: Array<{ property: string; value: IParsedCode['args'][number] }>;
      }
    | { list: IParsedCode['args'] }
    | { code: IParsedCode }
  >;
}
/**
 * Parse the regular transaction code;
 *
 * this does not include deploy contract code; for that use {@link pactParser }
 * @example
 * const code = '(coin.transfer "alice" "bob" 100)(free.my-contract.my-function "alice" "bob" [100.1 2] \{ "extra" : "some-data" \} )';
 * const parsed = execCodeParser(code);
 * // const parsed = [
 * //   \{
 * //     function: \{ module: 'coin', name: 'transfer' \},
 * //     args: [\{ string: 'alice' \}, \{ string: 'bob' \}, \{ int: 100 \}],
 * //   \},
 * //   \{
 * //     function: \{
 * //       namespace: 'free',
 * //       module: 'my-contract',
 * //       name: 'my-function',
 * //     \},
 * //     args: [
 * //       \{ string: 'alice' \},
 * //       \{ string: 'bob' \},
 * //       \{ list: [\{ decimal: 100.1 \}, \{ int: 2 \}] \},
 * //       \{ object: [\{ property: 'extra', value: [\{ string: 'some-data' \}] \}] \},
 * //     ],
 * //   \},
 * // ];
 * @alpha
 */
export function execCodeParser(code: string): undefined | IParsedCode[] {
  const pointer = getPointer(code);
  const result = functionCallParser(pointer);
  const data = unwrapData(result);
  if (data === FAILED) {
    return undefined;
  }
  return data?.codes as undefined | IParsedCode[];
}
