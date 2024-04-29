import {
  remarkAdmonitions,
  remarkCheckForCodeTitle,
  remarkFigureOutOfParagraph,
  remarkHeadersToProps,
  remarkPropsToStaticRender,
  remarkSideMenuToProps,
  remarkTwitter,
  remarkYoutube,
} from '@kadena/docs-tools';
import mdx from '@next/mdx';
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';
import { readFileSync } from 'fs';
import withYaml from 'next-plugin-yaml';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import { BUNDLED_LANGUAGES, getHighlighter } from 'shiki';
import redirectsConfig from './redirects.mjs';

const withVanillaExtract = createVanillaExtractPlugin();

const options = {
  // Use one of Shiki's packaged themes
  theme: {
    light: 'github-dark',
    dark: 'github-dark',
  },

  // Keep the background or use a custom background color?
  keepBackground: false,

  // Callback hooks to add custom logic to nodes when visiting
  // them.
  onVisitLine(node) {
    // Prevent lines from collapsing in `display: grid` mode, and
    // allow empty lines to be copy/pasted
    if (node.children.length === 0) {
      node.children = [{ type: 'text', value: ' ' }];
    }
  },
  onVisitHighlightedLine(node) {
    // Each line node by default has `class="line"`.
    node.properties.className.push('highlighted');
  },
  onVisitHighlightedWord(node) {
    // Each word node has no className by default.
    node.properties.className = ['word'];
  },

  getHighlighter: (options) => {
    const pactGrammer = JSON.parse(
      readFileSync('./src/scripts/pact.tmLanguage.json'),
    );
    const myLanguage = {
      id: 'Pact',
      scopeName: 'source.pact',
      grammar: pactGrammer,
      aliases: ['pact'],
    };

    return getHighlighter({
      ...options,
      langs: [...BUNDLED_LANGUAGES, myLanguage],
    });
  },
};

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    // If you use remark-gfm, you'll need to use next.config.mjs
    // as the package is ESM only
    // https://github.com/remarkjs/remark-gfm#install
    remarkPlugins: [
      remarkGfm,
      remarkFrontmatter,
      remarkHeadersToProps,
      remarkSideMenuToProps,
      remarkPropsToStaticRender,
      remarkAdmonitions,
      remarkYoutube,
      remarkTwitter,
      remarkCheckForCodeTitle,
      remarkFigureOutOfParagraph,
    ],
    rehypePlugins: [[rehypePrettyCode, options]],
    // If you use `MDXProvider`, uncomment the following line.
    providerImportSource: '@mdx-js/react',
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // lint is a different task/phase
  },

  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  reactStrictMode: true,
  transpilePackages: ['@kadena/react-ui', 'react-tweet'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
      },
    ],
  },
  async redirects() {
    return redirectsConfig;
  },
};

export default withYaml(withVanillaExtract(withMDX(nextConfig)));
