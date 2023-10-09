import type { FunctionComponentElement } from 'react';

export type CompoundType<T> = Tree<FunctionComponentElement<T>>;

type Tree<T> = T | Array<Tree<T>>;
