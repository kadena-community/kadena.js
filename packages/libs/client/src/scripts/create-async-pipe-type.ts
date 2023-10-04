import { writeFileSync } from 'fs';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function createAsyncPipeOverload(length: number) {
  const genericTypes = [];
  const functions = [];
  for (let i = 1; i <= length; i++) {
    const ext = i === 1 ? ' extends Any[]' : '';
    genericTypes.push(`T${i}${ext}`);
    const funcType = i === 1 ? 'Func' : 'UnaryFunction';
    const outputType = i === length ? 'TOut' : `T${i + 1}`;
    functions.push(`${funcType}<T${i}, ${outputType}>`);
  }

  return `<${genericTypes.join(', ')}, TOut>(
   ${functions.map((arg, i) => `op${i + 1}: ${arg}`).join(',\n')}\n
  ): {
    inputs: [${functions.join(', ')}];
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
type UnaryFunction<I, O> = (arg: Awaited<I>) => O;
type Output<T> = T extends Promise<Any> ? T : Promise<T>;
export interface IAsyncPipe {
    ${overloads.join('\n')}
  }`;
}

// eslint-disable-next-line @rushstack/typedef-var
const type = createAsyncPipeType(
  parseInt(process.argv[process.argv.length - 1]) || 10,
);

writeFileSync(
  path.join(__dirname, '..', 'interfaces', 'async-pipe-type.ts'),
  type,
  'utf-8',
);
