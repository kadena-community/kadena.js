// create a file input element
function createFileInput(types?: string[]) {
  const input: HTMLInputElement = document.createElement('input');
  input.setAttribute('type', 'file');
  if (types && types.length) {
    input.setAttribute('accept', types.join(', '));
  }
  return input;
}

// open file browser dialog and resolve a promise on file selection.
export function browse(
  multiple = false,
  types?: string[],
): Promise<FileList | File | null> {
  const input: HTMLInputElement = createFileInput(types);
  input.click(); // fire click event
  return new Promise<FileList | File | null>((resolve) => {
    input.onchange = function (event) {
      const { files } = event.target as HTMLInputElement;
      resolve(multiple ? files : files ? files[0] : null);
    };
  });
}

export const readContent = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.readAsText(file);
  });
};
