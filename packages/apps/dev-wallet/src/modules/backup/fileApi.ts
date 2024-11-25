export function isFileSystemAccessSupported() {
  return 'showDirectoryPicker' in window;
}

export async function getDirectoryHandle(): Promise<FileSystemDirectoryHandle> {
  if (
    'showDirectoryPicker' in window &&
    typeof window.showDirectoryPicker === 'function'
  ) {
    return window.showDirectoryPicker();
  }
  throw new Error('File System Access API is not supported');
}

export async function saveFile(
  handle: FileSystemDirectoryHandle,
  file: File,
): Promise<void> {
  const writable = await handle.getFileHandle(file.name, { create: true });
  const writableStream = await writable.createWritable();
  await writableStream.write(file);
  await writableStream.close();
}
