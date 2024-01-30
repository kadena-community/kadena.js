import {
  mkdirSync,
  readdirSync,
  renameSync,
  rmdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import { basename, join } from 'path';

export async function createDirAndWriteFile(
  dir: string,
  fileName: string,
  data: string,
): Promise<void> {
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, fileName), data);
}

export function clearDir(dir: string, extension?: string): void {
  const files = readdirSync(dir);
  for (const file of files) {
    const filePath = join(dir, file);
    try {
      if (statSync(filePath).isDirectory()) {
        clearDir(filePath, extension); // Recursive call
        rmdirSync(filePath); // Remove the directory itself
      } else if (!extension || file.endsWith(extension)) {
        unlinkSync(filePath);
      }
    } catch (error) {
      console.error(`Error processing file ${filePath}: ${error}`);
    }
  }
}
export async function flattenFolder(
  basePath: string,
  fileExtensions: string[],
  currentPath: string = basePath,
): Promise<void> {
  // Read directory
  const files = readdirSync(currentPath);
  for (const file of files) {
    const filePath = join(currentPath, file);

    // if directory, recurse and delete folder
    if (statSync(filePath).isDirectory()) {
      await flattenFolder(basePath, fileExtensions, filePath);
      rmdirSync(filePath);
    } else if (fileExtensions.some((ext) => file.endsWith(ext))) {
      // if file, rename to include parent folder name
      if (basePath === currentPath) continue;
      const relativePath = currentPath.replace(basePath, '');
      const folderChain = relativePath.split('/').filter(Boolean).join('.');
      const newFilePath = join(
        basePath,
        `${basename(folderChain)}.${basename(file)}`,
      );
      renameSync(filePath, newFilePath);
    }
  }
}
