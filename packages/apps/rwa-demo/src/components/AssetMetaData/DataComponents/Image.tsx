/* eslint-disable @next/next/no-img-element */
import { Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import type { IImageNode } from '../types';

export const ImageData: FC<{ node: IImageNode }> = ({ node }) => {
  return (
    <Stack
      {...node.props}
      flexDirection="column"
      style={node.props?.style || {}}
      data-type={node.type}
      data-propname={node.propName}
    >
      <img
        src={node.value}
        alt={node.label || 'image'}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </Stack>
  );
};
