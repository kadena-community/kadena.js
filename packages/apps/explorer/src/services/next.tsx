import React from 'react';
// eslint-disable-next-line @next/next/no-document-import-in-page
import { NextScript } from 'next/document';

function dedupe<T extends { file: string }>(bundles: T[]): T[] {
  const files = new Set<string>();
  const kept: T[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const bundle of bundles) {
    // eslint-disable-next-line no-continue
    if (files.has(bundle.file)) continue;
    files.add(bundle.file);
    kept.push(bundle);
  }
  return kept;
}

type DocumentFiles = {
  sharedFiles: readonly string[];
  pageFiles: readonly string[];
  allFiles: readonly string[];
};

export class DeferNextScript extends NextScript {
  getDynamicChunks(files: DocumentFiles) {
    const {
      dynamicImports,
      assetPrefix,
      isDevelopment,
      devOnlyCacheBusterQueryString,
    } = this.context;

    // @ts-expect-error Type 'string' is not assignable to type '{ file: string; }'.
    return dedupe(dynamicImports).map(bundle => {
      if (!bundle.file.endsWith('.js') || files.allFiles.includes(bundle.file))
        return null;

      return (
        <script
          defer={!isDevelopment}
          key={bundle.file}
          src={`${assetPrefix}/_next/${encodeURI(
            bundle.file,
          )}${devOnlyCacheBusterQueryString}`}
          nonce={this.props.nonce}
          crossOrigin={
            // eslint-disable-next-line no-underscore-dangle
            this.props.crossOrigin || process.env.__NEXT_CROSS_ORIGIN
          }
        />
      );
    });
  }

  getScripts(files: DocumentFiles) {
    const {
      assetPrefix,
      buildManifest,
      isDevelopment,
      devOnlyCacheBusterQueryString,
    } = this.context;

    const normalScripts = files.allFiles.filter(file => file.endsWith('.js'));
    const lowPriorityScripts = buildManifest.lowPriorityFiles?.filter(file =>
      file.endsWith('.js'),
    );

    return [...normalScripts, ...lowPriorityScripts].map(file => {
      return (
        <script
          key={file}
          src={`${assetPrefix}/_next/${encodeURI(
            file,
          )}${devOnlyCacheBusterQueryString}`}
          nonce={this.props.nonce}
          defer={!isDevelopment}
          crossOrigin={
            // eslint-disable-next-line no-underscore-dangle
            this.props.crossOrigin || process.env.__NEXT_CROSS_ORIGIN
          }
        />
      );
    });
  }
}
