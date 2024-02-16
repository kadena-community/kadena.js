import path from 'node:path';
import { TX_TEMPLATE_FOLDER } from '../../../constants/config.js';
import { services } from '../../../services/index.js';

const transferTemplate = `
code: |-
  (coin.transfer "{{{account-from}}}" "{{{account-to}}}" {{amount}})
data:
meta:
  chainId: "{{chain}}"
  sender: "{{{account-from}}}"
  gasLimit: 4600
  gasPrice: 0.000001
  ttl: 600
networkId: {{networkId}}
signers:
  - public: "{{pk-from}}"
    caps:
      - name: "coin.TRANSFER"
        args: ["{{{account-from}}}", "{{{account-to}}}", {{amount}}]
  - public: "{{pk-from}}"
    caps:
      - name: "coin.GAS"
        args: []
type: exec
`;

/** Only exported to be used in tests, otherwise use getTemplate() */
export const defaultTemplates = {
  transfer: transferTemplate,
} as Record<string, string>;

export const writeTemplatesToDisk = async (): Promise<void> => {
  await services.filesystem.ensureDirectoryExists(TX_TEMPLATE_FOLDER);
  for (const [name, template] of Object.entries(defaultTemplates)) {
    const filePath = path.join(TX_TEMPLATE_FOLDER, `${name}.yaml`);
    const exists = await services.filesystem.fileExists(filePath);
    if (exists === false) {
      await services.filesystem.writeFile(filePath, template);
    }
  }
};

export const getTemplate = async (filename: string): Promise<string> => {
  const filePath = path.join(TX_TEMPLATE_FOLDER, filename);
  const template = await services.filesystem.readFile(filePath);
  if (template !== null) {
    return template;
  }
  throw new Error(`Template "${filename}" not found`);
};

export const getTemplates = async (): Promise<Record<string, string>> => {
  const files = await services.filesystem.readDir(TX_TEMPLATE_FOLDER);
  const templates: Record<string, string> = {};
  for (const file of files) {
    const template = await getTemplate(file).catch(() => null);
    if (template !== null) {
      templates[file] = template;
    }
  }
  return templates;
};
