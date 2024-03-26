import type { PactToolboxClient } from '../client';

export type PactSpecDependencyRef = `$spec:${string}`;
export interface PactDependency {
  name: string;
  uri: string;
  group?: string;
  requires?: PactDependency[];
}
export type PactPreludeSpecs = Record<string, PactDependency[]>;
export interface PactPrelude {
  name: string;
  specs: PactDependency[] | PactPreludeSpecs;
  requires?: string[];
  /**
   * decides if prelude should be deployed to configured networks
   * useful to avoid re-deploying preludes that are already deployed eg. kadena/chainweb on devnet, testnet, mainnet
   */
  shouldDeploy: (client: PactToolboxClient) => Promise<boolean>;

  /**
   * deploy script fro local server
   */
  deploy(client: PactToolboxClient): Promise<void>;
  /**
   * pact repl install script
   */
  repl(client: PactToolboxClient): Promise<string>;
}

export interface CommonPreludeOptions {
  contractsDir: string;
  preludes?: (PactPrelude | string)[];
  client: PactToolboxClient;
}
