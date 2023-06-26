/**
 * the page will be slashed.
 * every H2 (##) will be the start of a new page
 */
import { createSlug } from '../../utils/createSlug';

import fs from 'fs';

const getMainTitle = (filename: string): string => {
  if (filename.includes('pact-functions')) return 'Built-in Functions';
  if (filename.includes('pact-properties')) return 'Property Checking System';
  return '';
};

const cleanContent = (content: string): string => {
  const cleanHeaderRegEx: RegExp = /(#+\s*.*?)\s*{[^}]+}/g;
  const codeBlockRegex: RegExp = /```[\s\S]*?```|^\s{4}.*$/gm;

  const cleanedContent = content
    .replace(cleanHeaderRegEx, '$1')
    .replace(/[<>{}\/]/g, (char: string): string => {
      const entityMap: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '{': '/}',
        '}': '\\}',
        '/': '&#x2F;',
      };
      return entityMap[char];
    });

  return cleanedContent.replace(codeBlockRegex, (match: string): string => {
    return match.replace(/['&amp;'''&lt;'']/g, (char: string): string => {
      const entityMap: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '{': '/}',
        '}': '\\}',
        '/': '&#x2F;',
      };
      return entityMap[char];
  });
};

const createFrontmatter = (
  title: string,
  parentTitle: string,
  idx: number,
): string => {
  return `
---
title: ${title}
menu: ${idx === 0 ? parentTitle : title}
label: ${title}
order: ${idx}
layout: full
---
    `;
};

const createPages = (filename: string): void => {
  const content = fs.readFileSync(filename, { encoding: 'utf8' });

  const headerSectionRegex: RegExp = /(?<=\n)(##\s[\s\S]*?)(?=\n##\s|\n$)/g;

  const matches: RegExpMatchArray | [] =
    content.match(headerSectionRegex) ?? [];

  //create the index page
  const parentTitle = getMainTitle(filename);
  const slug = createSlug(parentTitle);
  const dir = `./src/pages/docs/pact/reference/${slug}/`;
  console.log(slug);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  matches.forEach((content, idx) => {
    const cleanedContent = cleanContent(content);

    const headerRegEx: RegExp = /^##\s(.+)/m;
    const matches: RegExpMatchArray | [] =
      cleanedContent.match(headerRegEx) ?? [];

    if (matches[0] === undefined) {
      throw new Error('No title found?');
    }
    const frontmatter = createFrontmatter(matches[1], parentTitle, idx);

    const slug = idx === 0 ? 'index' : createSlug(matches[1]);

    fs.writeFileSync(`${dir}/${slug}.mdx`, `${frontmatter}${cleanedContent}`, {
      flag: 'w',
    });
  });
};

createPages('./import/pact/pact-functions.md');
createPages('./import/pact/pact-properties.md');
