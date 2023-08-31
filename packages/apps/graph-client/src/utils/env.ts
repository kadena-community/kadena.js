export interface IEnvInterface {
  CONFIRMED_CONFIRMATION_DEPTH?: number;
}

type RequiredEnv = Required<IEnvInterface>;

export const dotenv: IEnvInterface = {
  CONFIRMED_CONFIRMATION_DEPTH: Number(
    process.env.CONFIRMED_CONFIRMATION_DEPTH,
  ),
};

export const env = <T extends keyof RequiredEnv, TDefault>(
  key: T,
  defaultValue: TDefault,
): TDefault | NonNullable<RequiredEnv[T]> => {
  console.log(dotenv[key]);
  const falsyKey =
    (typeof dotenv[key] === 'number' && isNaN(Number(dotenv[key]))) ||
    dotenv[key] === null ||
    dotenv[key] === undefined;
  // TODO: uncomment this line when there's env vars that are strings
  //dotenv[key] === '';
  return falsyKey
    ? (defaultValue as TDefault)
    : (dotenv[key] as NonNullable<RequiredEnv[T]>);
};
