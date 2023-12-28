export function extractMetadataFromMarkdown(markdown: Buffer): Metadata {
  const markdownStr = markdown.toString();
  const charactersBetweenGroupedHyphens = /^---([\s\S]*?)---/;
  const metadataMatched = markdownStr.match(charactersBetweenGroupedHyphens);

    const metadata = metadataMatched![1];

    if (!metadata) {
     throw new Error('No metadata found.')
    }

    const metadataLines = metadata.split('\n');
    const metadataObject = metadataLines.reduce((accumulator, line) => {
      const [key, ...value] = line.split(':').map((part) => part.trim());

      if (key) accumulator[key] = value[1] ? value.join(':') : value.join('');
      return accumulator;
    }, {});

    return metadataObject as Metadata;
  };


export type Metadata = {
  title: string;
  description: string;
  menu: string;
  label: string;
  order: number;
  layout: 'full';
};
