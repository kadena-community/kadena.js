export const removeImageInfoFromMarkdown = (markdown: string): string => {
  // Regular expression to match Markdown image syntax
  const imageRegex = /!\[(.*?)\]\((.*?)\)/g;

  // Replace all image syntax with empty strings
  const cleanedMarkdown = markdown.replace(imageRegex, '');

  return cleanedMarkdown;
};
