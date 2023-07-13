import Debug from 'debug';

const debug = Debug('kadena-transfer:utils:file-download');

export function downloadFileToBrowser(filename: string, data: string): void {
  debug(downloadFileToBrowser.name);

  const blob = new Blob([data], { type: 'text/csv' });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window.navigator as any).msSaveOrOpenBlob !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.navigator as any).msSaveBlob(blob, filename);
  } else {
    const elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }
}
