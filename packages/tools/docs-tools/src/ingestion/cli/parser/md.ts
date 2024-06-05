import type { Literal, Node, Root } from 'mdast';
import { gfmToMarkdown } from 'mdast-util-gfm';
import { toMarkdown } from 'mdast-util-to-markdown';
import { remark } from 'remark';
import frontmatter from 'remark-frontmatter';
import gfm from 'remark-gfm';
import inlineLinks from 'remark-inline-links';
import { u } from 'unist-builder';
import yaml from 'yaml';
import type { DocumentParser } from '../types';
import { splitContentAtSentence } from './util';

const remarkInstance = remark().use(frontmatter).use(gfm).use(inlineLinks);

interface ISection {
  title: string;
  header: string;
  tree: Root;
  tags?: string[];
}

const isLiteral = (node: Node): node is Literal => 'value' in node;

export const createParser =
  (processor: ReturnType<typeof remark>): DocumentParser =>
  (markdown: Buffer | string, maxLength: number) => {
    const ast = processor.parse(markdown);
    const tree = processor.runSync(ast);

    let documentTitle: string | null = null;
    let documentTags: string[] = [];

    const sectionTrees = tree.children.reduce<ISection[]>((trees, node) => {
      if (node.type === 'yaml') {
        const parsedYaml = yaml.parse(node.value as string);
        if (parsedYaml.title) documentTitle = parsedYaml.title;
        if (parsedYaml.tags) documentTags = parsedYaml.tags;
        return trees;
      }

      const [lastTree] = trees.slice(-1);

      if (!lastTree?.tree || node.type === 'heading') {
        let title = '';
        let sectionHeader = '';
        if (node.type === 'heading') {
          title = node.children
            .map((child) => (isLiteral(child) ? child.value : ''))
            .join(' ');
          if (node.depth === 1 && !documentTitle) {
            documentTitle = title;
          }
          if (node.depth > 1 && !sectionHeader) {
            sectionHeader = title;
          }
        }
        const newTree = u('root', [node]);
        // @ts-ignore: This is a known issue with the types
        return trees.concat({ title, header: sectionHeader, tree: newTree });
      }
      // @ts-ignore: This is a known issue with the types
      lastTree.tree.children.push(node);
      return trees;
    }, []);

    const sectionContents = sectionTrees.map((section) => ({
      title: section.title,
      header: section.header,
      tags: documentTags,
      // @ts-ignore: This is a known issue with the types
      content: toMarkdown(section.tree, {
        extensions: [gfmToMarkdown()],
      }),
    }));

    const sections = sectionContents.flatMap((section) => {
      const subsections = splitContentAtSentence(section.content, maxLength);
      return subsections.map((s) => ({
        title: section.title,
        header: section.header,
        tags: section.tags,
        content: s,
      }));
    });

    return {
      title: documentTitle || '',
      sections,
    };
  };

export const parser = createParser(remarkInstance);
