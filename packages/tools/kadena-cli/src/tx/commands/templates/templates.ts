import path from 'node:path';
import { TX_TEMPLATE_FOLDER } from '../../../constants/config.js';
import { services } from '../../../services/index.js';

const transferTemplate = `
code: |-
  (coin.transfer "{{{account-from}}}" "{{{account-to}}}" {{decimal-amount}})
data:
meta:
  chainId: "{{chain-id}}"
  sender: "{{{account-from}}}"
  gasLimit: 2300
  gasPrice: 0.000001
  ttl: 600
signers:
  - public: "{{pk-from}}"
    caps:
      - name: "coin.TRANSFER"
        args: ["{{{account-from}}}", "{{{account-to}}}", {{decimal-amount}}]
      - name: "coin.GAS"
        args: []
networkId: "{{network-id}}"
type: exec
`;

const safeTransferTemplate = `
code: |-
  (coin.transfer "{{{account-from}}}" "{{{account-to}}}" {{decimal-amount}}))
  (coin.transfer "{{{account-to}}}" "{{{account-from}}}" 0.000000000001)
data:
meta:
  chainId: "{{chain-id}}"
  sender: {{{account-from}}}
  gasLimit: 2000
  gasPrice: 0.00000001
  ttl: 7200
signers:
  - public: {{pk-from}}
    caps:
      - name: "coin.TRANSFER"
        args: [{{{account-from}}}, {{{account-to}}}, {{decimal-amount}}]
      - name: "coin.GAS"
        args: []
  - public: {{pk-to}}
    caps:
      - name: "coin.TRANSFER"
        args: [{{{account-to}}}, {{{account-from}}}, 0.000000000001]
networkId: "{{network-id}}"
type: exec
`;

/** Only exported to be used in tests, otherwise use getTemplate() */
export const defaultTemplates = {
  transfer: transferTemplate,
  'safe-transfer': safeTransferTemplate,
} as Record<string, string>;

export const writeTemplatesToDisk = async (): Promise<string[]> => {
  await services.filesystem.ensureDirectoryExists(TX_TEMPLATE_FOLDER);
  const templatesAdded = [];
  for (const [name, template] of Object.entries(defaultTemplates)) {
    const filePath = path.join(TX_TEMPLATE_FOLDER, `${name}.ktpl`);
    const exists = await services.filesystem.fileExists(filePath);
    if (exists === false) {
      await services.filesystem.writeFile(filePath, template);
      templatesAdded.push(`${name}.ktpl`);
    }
  }
  return templatesAdded;
};

export const getTemplate = async (filename: string): Promise<string> => {
  const cwdFile = await services.filesystem.readFile(filename);
  if (cwdFile !== null) {
    return cwdFile;
  }
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
