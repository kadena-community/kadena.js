import {
  Card,
  ContentHeader,
  Divider,
  Heading,
  Text,
  TextLink,
} from '@kadena/kode-ui';

import { MonoWallet } from '@kadena/kode-icons/system';
import clsx from 'clsx';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import parse, {
  DOMNode,
  Element,
  HTMLReactParserOptions,
} from 'html-react-parser';
import MarkdownIt from 'markdown-it';
import React, { useEffect, useRef, useState } from 'react';
import markdownContentRaw from './docs.md?raw';

export type HeadingElementType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type HeadingVariant = 'ui' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const isElement = (node: DOMNode): node is Element => {
  return node.type === 'tag';
};

const mdParser: MarkdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const highlighted = hljs.highlight(str, { language: lang }).value;
        return `<pre class="hljs"><code class="language-${lang} hljs">${highlighted}</code></pre>`;
      } catch (error) {
        console.error('Highlighting error:', error);
      }
    }
    const escaped = mdParser.utils.escapeHtml(str);
    return `<pre class="hljs"><code class="hljs">${escaped}</code></pre>`;
  },
});

const MarkdownPage: React.FC = () => {
  const [content, setContent] = useState<React.ReactNode>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const processMarkdown = () => {
      try {
        const rawHtml = mdParser.render(markdownContentRaw);

        const sanitizedHtml = DOMPurify.sanitize(rawHtml, {
          ALLOWED_TAGS: [
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'p',
            'code',
            'pre',
            'strong',
            'em',
            'a',
            'ul',
            'ol',
            'li',
            'blockquote',
            'hr',
            'img',
            'table',
            'thead',
            'tbody',
            'tr',
            'th',
            'td',
            'span',
          ],
          ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class'],
        });

        const options: HTMLReactParserOptions = {
          replace: (domNode) => {
            if (!isElement(domNode)) {
              return undefined;
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const element = domNode as any;

            if (element.name === 'hr') {
              return <Divider className="my-4" />;
            }

            if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(element.name)) {
              const level = parseInt(element.name.charAt(1), 10) as
                | 1
                | 2
                | 3
                | 4
                | 5
                | 6;
              return (
                <Heading
                  as={`h${level}` as HeadingElementType}
                  className="my-4"
                >
                  {parse(domToString(element.children), options)}
                </Heading>
              );
            }

            if (element.name === 'p') {
              return (
                <Text variant="body" className="my-2">
                  {parse(domToString(element.children), options)}
                </Text>
              );
            }

            if (
              element.name === 'pre' &&
              element.children[0]?.name === 'code'
            ) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const codeElement = element.children[0] as any;
              const className = codeElement.attribs.class || '';
              const language =
                className.replace('language-', '') || 'plaintext';
              const highlighted = domToString(codeElement.children);

              return (
                <pre className={clsx('hljs', 'overflow-auto')}>
                  <code
                    className={`language-${language} hljs`}
                    dangerouslySetInnerHTML={{ __html: highlighted }}
                  />
                </pre>
              );
            }

            if (element.name === 'code' && element.parent?.name !== 'pre') {
              const codeContent = domToString(element.children);
              return (
                <Text
                  variant="code"
                  as="code"
                  className="bg-gray-200 p-1 rounded"
                >
                  {codeContent}
                </Text>
              );
            }

            if (element.name === 'a') {
              const href = element.attribs.href || '#';
              const isDisabled = element.attribs['data-disabled'] === 'true';
              const isCompact = element.attribs['data-compact'] === 'true';
              const withIcon = element.attribs['data-with-icon'] === 'true';
              const childrenContent = parse(
                domToString(element.children),
                options,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ) as any;

              return (
                <TextLink
                  href={href}
                  isDisabled={isDisabled}
                  isCompact={isCompact}
                  withIcon={withIcon}
                >
                  {childrenContent}
                </TextLink>
              );
            }

            return undefined;
          },
        };

        const reactContent = parse(sanitizedHtml, options);

        setContent(reactContent);
      } catch (error) {
        console.error('Error processing Markdown:', error);
      }
    };

    processMarkdown();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      const codeBlocks = contentRef.current.querySelectorAll('pre code');
      codeBlocks.forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }
  }, [content]);

  const domToString = (children: DOMNode[]): string => {
    return children
      .map((child) => {
        if (child.type === 'text') {
          return child.data || '';
        } else if (isElement(child)) {
          const attrs = Object.entries(child.attribs || {})
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
          const childrenHtml = child.children
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              domToString(child.children as any)
            : '';
          return `<${child.name}${attrs}>${childrenHtml}</${child.name}>`;
        }
        return '';
      })
      .join('');
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto p-6">
      <Card fullWidth>
        <ContentHeader
          heading="Wallet Example"
          description="Created with: @kadena/wallet-sdk"
          icon={<MonoWallet />}
        />
        <div className="my-4">
          <Divider />
        </div>

        <div
          className="markdown-content prose lg:prose-xl mt-6"
          ref={contentRef}
        >
          {content}
        </div>
      </Card>
    </div>
  );
};

export default MarkdownPage;
