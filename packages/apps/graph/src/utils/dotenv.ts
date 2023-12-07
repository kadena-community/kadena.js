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
  MARMALADE_REPOSITORY_OWNER: string;
  MARMALADE_REPOSITORY_NAME: string;
  MARMALADE_REPOSITORY_BRANCH: string;
  MARMALADE_TEMPLATE_REMOTE_PATH: string[];
  MARMALADE_NAMESPACE_REMOTE_PATH: string[];
  MARMALADE_TEMPLATE_LOCAL_PATH: string;
  MARMALADE_NAMESPACE_LOCAL_PATH: string;
  // MARMALADE_TEMPLATE_OWNER: string;
  // MARMALADE_TEMPLATE_REPO: string;
  // MARMALADE_TEMPLATE_PATH: string;
  // MARMALADE_TEMPLATE_BRANCH: string;
  // MARMALADE_TEMPLATE_LOCAL_PATH: string;
  // MARMALADE_NS_FILE_PATH: string;
  // MARMALADE_NS_LOCAL_PATH: string;
  GITHUB_TOKEN: string;
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
  MARMALADE_REPOSITORY_OWNER: or(
    process.env.MARMALADE_REPOSITORY_OWNER,
    'kadena-io',
  ),
  MARMALADE_REPOSITORY_NAME: or(
    process.env.MARMALADE_REPOSITORY_NAME,
    'marmalade',
  ),
  MARMALADE_REPOSITORY_BRANCH: or(
    process.env.MARMALADE_REPOSITORY_BRANCH,
    'main',
  ),
  MARMALADE_TEMPLATE_REMOTE_PATH: or(
    process.env.MARMALADE_TEMPLATE_REMOTE_PATH?.split(','),
    ['pact/yaml/marmalade-v2'],
  ),
  MARMALADE_NAMESPACE_REMOTE_PATH: or(
    process.env.MARMALADE_NAMESPACE_REMOTE_PATH?.split(','),
    ['pact/marmalade-ns', 'pact/util'],
  ),

  MARMALADE_TEMPLATE_LOCAL_PATH: or(
    process.env.MARMALADE_TEMPLATE_LOCAL_PATH,
    'src/devnet/marmalade/templates/v2',
  ),
  MARMALADE_NAMESPACE_LOCAL_PATH: or(
    process.env.MARMALADE_NS_LOCAL_PATH,
    'src/devnet/marmalade/templates/ns',
  ),
  GITHUB_TOKEN: or(process.env.GITHUB_TOKEN, '/pact/marmalade-ns'),
};

function or<T>(value: T | undefined, otherwise: T): T {
  return value === undefined ? otherwise : value;
}
