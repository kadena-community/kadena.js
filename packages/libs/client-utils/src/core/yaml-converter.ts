import { IPactCommand } from '@kadena/client';
import { readFile } from 'fs/promises';
import yaml from 'js-yaml';

interface IKdaToolTransaction {
  command: string;
  meta: {
    chainId: string;
    sender: string;
    gasLimit: number;
    gasPrice: number;
    ttl: number;
  };
  data: Record<string, any>;
  signers: Array<{ public: string }>;
  nonce: string;
}

export const replaceHoles = (
  yamlString: string,
  holes: Record<string, any>,
) => {
  yamlString.replace(/{{(.*?)}}/g, (match, p1) => holes[p1]);
  ``;
};

export const loadYaml = async (path: string): Promise<any> => {
  const yamlString = await readFile(path);
  return yaml.load(yamlString.toString());
};

export const yamlToKda = async (
  path: string,
  holes: Record<string, any>,
  cwd: string = process.cwd(),
): Promise<IKdaToolTransaction> => {
  const yaml = loadYaml(path);

  // Replace holes
  const yamlString = yaml.toString();
  const replacedYamlString = yamlString.replace(
    /{{(.*?)}}/g,
    (match, p1) => holes[p1],
  );

  return {} as IKdaToolTransaction;
};

export const convertToKadenaClientTransaction = async (
  dkaToolTx: IKdaToolTransaction,
): Promise<IPactCommand> => {
  return {} as IPactCommand;
};

//Function to create object from yaml file and replace holes

// Function to convert to kadena client transaction
