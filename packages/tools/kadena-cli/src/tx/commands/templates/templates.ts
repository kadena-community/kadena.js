import path from 'node:path';
import { services } from '../../../services/index.js';
import { KadenaError } from '../../../services/service-error.js';
import { getTxTemplateDirectory } from '../../utils/txHelpers.js';

const transferTemplate = `
code: |-
  (coin.transfer "{{{account:from}}}" "{{{account:to}}}" {{decimal:amount}})
data:
meta:
  chainId: "{{chain-id}}"
  sender: "{{{account:from}}}"
  gasLimit: 2300
  gasPrice: 0.000001
  ttl: 600
signers:
  - public: "{{key:from}}"
    caps:
      - name: "coin.TRANSFER"
        args: ["{{{account:from}}}", "{{{account:to}}}", {{decimal:amount}}]
      - name: "coin.GAS"
        args: []
networkId: "{{network:networkId}}"
type: exec
`;

const safeTransferTemplate = `
code: |-
  (coin.transfer "{{{account:from}}}" "{{{account:to}}}" {{decimal:amount}}))
  (coin.transfer "{{{account:to}}}" "{{{account:from}}}" 0.000000000001)
data:
meta:
  chainId: "{{chain-id}}"
  sender: {{{account:from}}}
  gasLimit: 2000
  gasPrice: 0.00000001
  ttl: 7200
signers:
  - public: {{key:from}}
    caps:
      - name: "coin.TRANSFER"
        args: [{{{account:from}}}, {{{account:to}}}, {{decimal:amount}}]
      - name: "coin.GAS"
        args: []
  - public: {{key:to}}
    caps:
      - name: "coin.TRANSFER"
        args: [{{{account:to}}}, {{{account:from}}}, 0.000000000001]
networkId: "{{network:networkId}}"
type: exec
`;

/** Only exported to be used in tests, otherwise use getTemplate() */
export const defaultTemplates = {
  transfer: transferTemplate,
  'safe-transfer': safeTransferTemplate,
} as Record<string, string>;

export const writeTemplatesToDisk = async (): Promise<string[]> => {
  const templateFolder = getTxTemplateDirectory();
  if (templateFolder === null) {
    throw new KadenaError('no_kadena_directory');
  }
  await services.filesystem.ensureDirectoryExists(templateFolder);
  const templatesAdded = [];
  for (const [name, template] of Object.entries(defaultTemplates)) {
    const filePath = path.join(templateFolder, `${name}.ktpl`);
    const exists = await services.filesystem.fileExists(filePath);
    if (exists === false) {
      await services.filesystem.writeFile(filePath, template);
      templatesAdded.push(`${name}.ktpl`);
    }
  }
  return templatesAdded;
};

export const getTemplate = async (filename: string): Promise<string> => {
  const templateFolder = getTxTemplateDirectory();
  if (templateFolder === null) {
    throw new KadenaError('no_kadena_directory');
  }
  const cwdFile = await services.filesystem.readFile(filename);
  if (cwdFile !== null) {
    return cwdFile;
  }
  const filePath = path.join(templateFolder, filename);
  const template = await services.filesystem.readFile(filePath);
  if (template !== null) {
    return template;
  }
  throw new Error(`Template "${filename}" not found`);
};

export const getTemplates = async (): Promise<Record<string, string>> => {
  const templateFolder = getTxTemplateDirectory();
  if (templateFolder === null) {
    throw new KadenaError('no_kadena_directory');
  }
  const files = await services.filesystem.readDir(templateFolder);
  const templates: Record<string, string> = {};
  for (const file of files) {
    const template = await getTemplate(file).catch(() => null);
    if (template !== null) {
      templates[file] = template;
    }
  }
  return templates;
};
