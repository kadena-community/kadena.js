export function downloadAsFile(
  content: string,
  filename: string,
  type = 'application/json',
) {
  // Create a Blob with the JSON string
  const blob = new Blob([content], { type });

  // Create a link element
  const link = document.createElement('a');

  // Set the link's href to a URL representing the Blob
  link.href = URL.createObjectURL(blob);

  // Set the download attribute with the desired filename
  link.download = filename;

  // Append the link to the body temporarily and trigger the download
  document.body.appendChild(link);
  link.click();

  // Clean up: remove the link element and revoke the Blob URL
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
