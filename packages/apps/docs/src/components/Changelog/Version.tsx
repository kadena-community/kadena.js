import { Heading, Stack, Text } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Commits } from './Commits';
import { versionWrapperClass } from './styles.css';

interface IProps {
  version: IChangelogPackageVersion;
}

export const Version: FC<IProps> = ({ version }) => {
  return (
    <Stack flexDirection="column" gap="lg">
      <Heading as="h3" variant="h3">
        {version.label}
      </Heading>

      {version.description && (
        <Text as="span" variant="body" className={versionWrapperClass}>
          <ReactMarkdown rehypePlugins={[rehypeRaw] as any}>
            {version.description}
          </ReactMarkdown>
        </Text>
      )}

      <Commits label="Minors" commits={version.minors} />
      <Commits label="Patches" commits={version.patches} />
      <Commits label="Misc" commits={version.miscs} />
    </Stack>
  );
};
