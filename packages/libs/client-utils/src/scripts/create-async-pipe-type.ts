import { writeFile } from 'fs/promises';
import path from 'path';
import * as prettier from 'prettier';

function createAsyncPipeOverload(length: number) {
  const genericTypes: string[] = [];
  const functions: string[] = [];
  const Events: string[] = [];
  for (let i = 1; i <= length; i++) {
    const ext = i === 1 ? ' extends Any[]' : '';
    genericTypes.push(`T${i}${ext}`);
    Events.push(`EVENTS${i}`);
    const outputType = i === length ? 'TOut' : `T${i + 1}`;
    if (i === 1) {
      functions.push(`Func<T${i}, ${outputType}, EVENTS${i}>`);
    } else {
      functions.push(`PipeFunction<T${i}, ${outputType}, EVENTS${i}>`);
    }
  }

  return `<${genericTypes.join(', ')}, TOut, ${Events.map(
    (name) => `${name}`,
  ).join(', ')}>(
   ${functions.map((arg, i) => `op${i + 1}: ${arg}`).join(',\n')}\n
  ): {
    _event_type: [${Events.map((name) => `...AsArray<${name}>`).join(',')}];
    (...args: T1): Output<TOut>;
  };
  `;
}

function createAsyncPipeType(maxLength: number) {
  const overloads = Array.from({ length: maxLength }, (arg, i) =>
    createAsyncPipeOverload(i + 1),
  );

  return `
/**
 * THIS FILE IS GENERATED. DO NOT EDIT.
 * check ../scripts/create-async-pipe-type.ts
 * */
// eslint-disable-next-line @kadena-dev/no-eslint-disable
/* eslint-disable max-lines */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;
type Func<I extends Any[], O, EVENTS = never> = ((...args: I) => O) & {_event_type?: EVENTS};
type PipeFunction<I, O, EVENTS = never> = ((arg: Awaited<I>)=> O) & {_event_type?: EVENTS};
type Output<T> = T extends Promise<Any> ? T : Promise<T>;
type AsArray<T> = T extends Any[] ? T : [];
export interface IAsyncPipe {
    ${overloads.join('\n')}
  }`;
}

const type = createAsyncPipeType(
  parseInt(process.argv[process.argv.length - 1]) || 10,
);

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
