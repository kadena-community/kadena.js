// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-explicit-any
type all = any;

export const head = (args: all[]): any => args[0];

export const inspect =
  (tag: string): (<T extends unknown>(data: T) => T) =>
  <T extends any>(data: T): T => {
    console.log(tag, data);
    return data;
  };
