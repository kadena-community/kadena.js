import JSONC from 'jsonc-parser';
import fs from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const DIRNAME = dirname(fileURLToPath(import.meta.url));
const RULES_DIR = join(DIRNAME, 'rules');
async function importModules(dir) {
  const files = await fs.readdir(dir);
  const moduleFiles = files.filter((file) => extname(file) === '.js');
  const modules = [];
  for (const file of moduleFiles) {
    const module = await import(new URL(join(dir, file), 'file://').toString());
    modules.push(module.default);
  }
  return modules;
}
export const loadJSON = async (filePath) =>
  JSON.parse(await fs.readFile(filePath, 'utf-8'));
export const loadJSONC = async (filePath) =>
  JSONC.parse(await fs.readFile(filePath, 'utf-8'));
export const loadContents = async (filePath) =>
  await fs.readFile(filePath, 'utf-8');
export const loadRules = (dir) => importModules(join(RULES_DIR, dir));
