import fs from 'fs';
import yaml from 'js-yaml';
import { OpenAPIV3 } from 'openapi-types';

const createFrontmatter = (
  title: string,
  parentTitle: string,
  idx: number,
): string => {
  return `
---
title: ${title}
menu: ${parentTitle}
label: ${title}
order: ${idx}
layout: full
---
            `;
};

let components: OpenAPIV3.ComponentsObject | undefined;
let paths: OpenAPIV3.PathsObject | undefined;
let info: OpenAPIV3.InfoObject | undefined;
let tags: OpenAPIV3.TagObject[] | undefined;

const getPaths = (tag: string, paths?: OpenAPIV3.PathsObject): string => {
  if (!paths) return '';

  const pathArray = Object.entries(paths);

  const foundPaths = pathArray.find(([name, path]) => {
    if (!path) return false;

    const pathKeys = Object.keys(path) as Array<keyof OpenAPIV3.PathItemObject>;

    const foundTags = pathKeys.filter((key) => {
      const obj = path[key];
      if (!obj || typeof obj === 'string' || Array.isArray(obj)) return false;
      if (!Array.isArray(obj?.tags)) return false;

      return obj.tags.includes(tag);
    });

    // console.log(foundTags);
    return foundTags.length;
  });

  if (!foundPaths?.length) return '';
  return `

    \`\`\`
    ${foundPaths?.reduce((acc, item) => {
      if (!item) return '';
      return `${acc} v${item}`;
    }, 's')}
    \`\`\`
  `;

  //   Array.from(paths);

  //   const foundPaths = paths.filter((path: OpenAPIV3.PathItemObject) => {
  //     console.log(path.tags);
  //     return false;
  //   });
};

const createSpecPage = (filename: string) => {
  const contentYml = fs.readFileSync(filename, 'utf8');
  const doc: OpenAPIV3.Document = yaml.load(contentYml) as OpenAPIV3.Document;

  components = doc.components;
  paths = doc.paths;
  info = doc.info || {};
  tags = doc.tags ?? [];

  const content = `
  ${createFrontmatter(' Kadena Chainweb Node API', 'Chainweb', 1)}
    
  ${tags.reduce((acc: string, item: any) => {
    return `${acc} ## ${item['x-displayName']} (${item.name}) \n
    
    \`\`\`${item.description}\`\`\`


    ${getPaths(item.name, doc.paths)}
    
    `;
  }, '')}
  `;

  fs.writeFileSync(`./src/pages/docs/chainweb/openapi.mdx`, content, {
    flag: 'w',
  });
};

createSpecPage('./src/specs/chainweb/chainweb.openapi.yaml');
