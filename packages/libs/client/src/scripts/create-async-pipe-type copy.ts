import { writeFile } from 'fs/promises';
import path from 'path';
import * as prettier from 'prettier';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function createAsyncPipeOverload(length: number) {
  const genericTypes = [];
  const args: string[] = [];
  const functions = [];
  const parameters = [];
  for (let i = 1; i <= length; i++) {
    const ext = i === 1 ? ' extends Any[]' : '';
    genericTypes.push(`T${i}${ext}`);
    functions.push(`F${i}`);
    const outputType = i === length ? 'TOut' : `T${i + 1}`;
    let arg = '';
    if (i === 1) {
      arg = `Func<T${i}, ${outputType}>`;
    } else {
      arg = `PipeFunction<T${i}, ${outputType}>`;
    }
    args.push(arg);
    parameters.push(`F${i} = { inputs?: Any[] } & ${arg}`);
  }

  return `<${genericTypes.join(', ')}, TOut, ${parameters.join(',')}>(
   ${functions
     .map((fType, i) => `op${i + 1}: ${fType} & ${args[i]}`)
     .join(',\n')}\n
  ): {
    inputs: [${functions.map((name) => `...FlatInputs<${name}>`).join(', ')}];
    (...args: T1): Output<TOut>;
  };
  `;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function createAsyncPipeType(maxLength: number) {
  const overloads = Array.from({ length: maxLength }, (arg, i) =>
    createAsyncPipeOverload(i + 1),
  );

  return `
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;
type Func<I extends Any[], O> = (...args: I) => O;
type PipeFunction<I, O> = (arg: Awaited<I>) => O;
type Output<T> = T extends Promise<Any> ? T : Promise<T>;
type AsArray<T> = T extends Any[] ? T : [];
type FlatInputs<T> = T extends { inputs: infer I } ? [T,...AsArray<I>] : [T];
export interface IAsyncPipe {
    ${overloads.join('\n')}
  }`;
}

// eslint-disable-next-line @rushstack/typedef-var
const type = createAsyncPipeType(
  parseInt(process.argv[process.argv.length - 1]) || 10,
);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function run() {
  return writeFile(
    path.join(__dirname, '..', 'interfaces', 'async-pipe-type.ts'),
    await prettier.format(type, { parser: 'typescript' }),
    'utf-8',
  );
}

run().catch((err) => {
  console.error(err);
});
