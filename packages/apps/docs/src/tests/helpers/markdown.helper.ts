const parseMD = require('parse-md').default;
import fs from 'fs';




 export async function extractMetadataFromMarkdown(
    parentPath: string,
    childPath?: string,
    grandChildPath?: string,
  ): Promise<Metadata[]> {
    const metadata: Metadata[] = [];


    const parentFile = fs.readFileSync(parentPath, 'utf8');
    const parent  = parseMD(parentFile);
    metadata.push(parent.metadata);

    if (childPath) {
      const childFile = fs.readFileSync(childPath, 'utf8');
      const child  = parseMD(childFile);
      metadata.push(child.metadata);
    }

    if (grandChildPath) {
      const grandChildFile = fs.readFileSync(grandChildPath, 'utf8');
      const  grandChild  = parseMD(grandChildFile);
      metadata.push(grandChild.metadata);
    }
    return metadata
  }




export type Metadata = {
  title: string;
  description: string;
  menu: string;
  label: string;
  order: number;
  layout: 'full';
};
