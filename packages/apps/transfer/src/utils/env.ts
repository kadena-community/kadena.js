export interface IEnvInterface {
  KADENA_API_TTIL?: number;
  KADENA_MAINNET_API?: string;
  KADENA_TESTNET_API?: string;
  KADENA_MAINNET_ESTATS?: string;
  KADENA_TESTNET_ESTATS?: string;
  GAS_LIMIT?: number;
  GAS_PRICE?: number;
  DEFAULT_SENDER?: string;
}

export const dotenv: IEnvInterface = {
  KADENA_API_TTIL: Number(process.env.KADENA_API_TTIL),
  KADENA_MAINNET_API: process.env.KADENA_MAINNET_API,
  KADENA_TESTNET_API: process.env.KADENA_TESTNET_API,
  KADENA_MAINNET_ESTATS: process.env.KADENA_MAINNET_ESTATS,
  KADENA_TESTNET_ESTATS: process.env.KADENA_TESTNET_ESTATS,
  GAS_LIMIT: Number(process.env.GAS_LIMIT),
  GAS_PRICE: Number(process.env.GAS_PRICE),
  DEFAULT_SENDER: process.env.DEFAULT_SENDER,
};

export const env = <T extends keyof IEnvInterface, TDefault>(
  key: T,
  defaultValue: TDefault,
): TDefault | NonNullable<IEnvInterface[T]> => {
  const falsyKey = dotenv[key] === '' || dotenv[key] === undefined || dotenv[key] === null;

  return falsyKey ? defaultValue as TDefault : dotenv[key] as NonNullable<IEnvInterface[T]>;
};
