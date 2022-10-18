export function downloadFile(data: any, filename: string, type: string) {
  const file = new Blob([data], { type });
  // @ts-expect-error Property 'msSaveOrOpenBlob' does not exist on type 'Navigator'.
  if (window.navigator.msSaveOrOpenBlob)
    // IE10+
    // @ts-expect-error Property 'msSaveOrOpenBlob' does not exist on type 'Navigator'.
    window.navigator.msSaveOrOpenBlob(file, filename);
  else {
    const a = document.createElement('a');
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}
