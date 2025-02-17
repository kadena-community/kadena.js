export const logTap =
  (msg: string) =>
  <T>(x: T): T => {
    console.log(msg, x);
    return x;
  };
