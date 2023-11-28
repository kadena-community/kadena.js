import * as _dotenv from 'dotenv';

_dotenv.config();

export const dotenv: {
  CHAIN_COUNT: number;
  DATABASE_URL: string;
  MAX_CALCULATED_BLOCK_CONFIRMATION_DEPTH: number;
  NETWORK_HOST: string;
  NETWORK_ID: string;
  TRACING_ENABLED: boolean;
  TRACING_LOG_FILENAME: string;
  MARMALADE_ENABLED: boolean;
  MARMALADE_TEMPLATE_OWNER: string;
  MARMALADE_TEMPLATE_REPO: string;
  MARMALADE_TEMPLATE_PATH: string;
  MARMALADE_TEMPLATE_BRANCH: string;
  MARMALADE_TEMPLATE_LOCAL_PATH: string;
} = {
  CHAIN_COUNT: parseInt(or(process.env.CHAIN_COUNT, '20'), 10),
  DATABASE_URL: or(
    process.env.DATABASE_URL,
    'postgresql://devnet@localhost:5432/devnet',
  ),
  MAX_CALCULATED_BLOCK_CONFIRMATION_DEPTH: parseInt(
    or(process.env.MAX_CALCULATED_BLOCK_CONFIRMATION_DEPTH, '11'),
    10,
  ),
  NETWORK_HOST: or(process.env.NETWORK_HOST, 'localhost:8080'),
  NETWORK_ID: or(process.env.NETWORK_ID, 'fast-development'),
  TRACING_ENABLED: or(process.env.TRACING_ENABLED === 'true', false),
  TRACING_LOG_FILENAME: or(process.env.TRACING_LOG_FILENAME, 'traces.log'),
  MARMALADE_ENABLED: or(process.env.MARMALADE_ENABLED === 'true', false),
  MARMALADE_TEMPLATE_OWNER: or(
    process.env.MARMALADE_TEMPLATE_OWNER,
    'kadena-io',
  ),
  MARMALADE_TEMPLATE_REPO: or(process.env.MARMALADE_TEMPLATE_REPO, 'marmalade'),
  MARMALADE_TEMPLATE_PATH: or(
    process.env.MARMALADE_TEMPLATE_PATH,
    'pact/yaml/marmalade-v2',
  ),
  MARMALADE_TEMPLATE_BRANCH: or(process.env.MARMALADE_TEMPLATE_BRANCH, 'v2'),
  MARMALADE_TEMPLATE_LOCAL_PATH: or(
    process.env.MARMALADE_TEMPLATE_LOCAL_PATH,
    'src/devnet/templates',
  ),
};

function or<T>(value: T | undefined, otherwise: T): T {
  return value === undefined ? otherwise : value;
}
