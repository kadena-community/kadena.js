import path, { isAbsolute } from 'node:path';
import { services } from '../../../../services/index.js';
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
  (coin.transfer "{{{account:from}}}" "{{{account:to}}}" {{decimal:amount}})
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

const transferCreateTemplate = `
code: |-
  (coin.transfer-create "{{{account:from}}}" "{{{account:to}}}" (read-keyset "account-guard") {{{decimal:amount}}})
data:
  account-guard:
    keys:
      - {{{key:to}}}
    pred: {{{predicate}}}
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
networkId: "{{network:networkId}}"
type: exec
`;

export const arbitraryCodeTemplate = `
code: |-
  {{{code}}}
data:
meta:
  chainId: "{{chain-id}}"
  gasLimit: {{gasLimit}}
  gasPrice: 0.000001
  ttl: 600
  sender: "local"
networkId: "{{network:networkId}}"
type: exec
`;

/** Only exported to be used in tests, otherwise use getTemplate() */
export const defaultTemplates = {
  transfer: transferTemplate,
  'safe-transfer': safeTransferTemplate,
  'transfer-create': transferCreateTemplate,
} as Record<string, string>;

export const writeTemplatesToDisk = async (): Promise<string[]> => {
  const templateFolder = getTxTemplateDirectory();
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

export const getTemplate = async (
  filename: string,
): Promise<{ template: string; path: string; cwd: string }> => {
  const templateFolder = getTxTemplateDirectory();
  const cwd = process.cwd();

  const cwdFile = await services.filesystem.readFile(filename);
  if (cwdFile !== null) {
    return {
      template: cwdFile,
      path: isAbsolute(filename) ? path.relative(cwd, filename) : filename,
      cwd,
    };
  }

  const filePath = path.join(templateFolder, filename);

  const template = await services.filesystem.readFile(filePath);
  if (template !== null) {
    return { template, path: filename, cwd: templateFolder };
  }
  throw new Error(`Template "${filename}" not found`);
};

export const getTemplates = async (): Promise<
  Array<{ filename: string; template: string; path: string; cwd: string }>
> => {
  const templateFolder = getTxTemplateDirectory();
  const files = (await services.filesystem.readDir(templateFolder)).filter(
    (file) => file.endsWith('.ktpl'),
  );
  const templates: Array<{
    filename: string;
    template: string;
    path: string;
    cwd: string;
  }> = [];

  for (const file of files) {
    const templateObj = await getTemplate(file).catch(() => null);
    if (templateObj !== null) {
      templates.push({
        filename: file,
        ...templateObj,
      });
    }
  }

  return templates;
};
