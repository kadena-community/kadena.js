export interface IEnvInterface {
  KADENA_API_TTIL?: number;
  KADENA_MAINNET_API?: string;
  KADENA_TESTNET_API?: string;
  KADENA_MAINNET_ESTATS?: string;
  KADENA_TESTNET_ESTATS?: string;
  GAS_LIMIT?: number;
  FAUCET_PUBLIC_KEY?: string;
  FAUCET_PRIVATE_KEY?: string;
  GAS_PRICE?: number;
  DEFAULT_SENDER?: string;
}

type RequiredEnv = Required<IEnvInterface>;

export const dotenv: IEnvInterface = {
  KADENA_API_TTIL: Number(process.env.KADENA_API_TTIL),
  KADENA_MAINNET_API: process.env.KADENA_MAINNET_API,
  KADENA_TESTNET_API: process.env.KADENA_TESTNET_API,
  KADENA_MAINNET_ESTATS: process.env.KADENA_MAINNET_ESTATS,
  KADENA_TESTNET_ESTATS: process.env.KADENA_TESTNET_ESTATS,
  GAS_LIMIT: Number(process.env.GAS_LIMIT),
  FAUCET_PUBLIC_KEY: process.env.FAUCET_PUBLIC_KEY,
  FAUCET_PRIVATE_KEY: process.env.FAUCET_PRIVATE_KEY,
  GAS_PRICE: Number(process.env.GAS_PRICE),
  DEFAULT_SENDER: process.env.DEFAULT_SENDER,
};

export const env = <T extends keyof RequiredEnv, TDefault>(
  key: T,
  defaultValue: TDefault,
): TDefault | NonNullable<RequiredEnv[T]> => {
  const falsyKey =
    (typeof dotenv[key] === 'number' && isNaN(Number(dotenv[key]))) ||
    dotenv[key] === null ||
    dotenv[key] === undefined ||
    dotenv[key] === '';

  return falsyKey
    ? (defaultValue as TDefault)
    : (dotenv[key] as NonNullable<RequiredEnv[T]>);
};
