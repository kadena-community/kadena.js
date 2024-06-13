// Get type of array element
export type ElementType<T> = T extends (infer U)[] ? U : never;

// @see https://stackoverflow.com/a/61108377/1463352
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
