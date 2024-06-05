import type { IMetaData } from '../shared/index.js';

export interface IFile {
  filePath: string;
  url: string;
  content: Buffer;
}

export type FetchFiles = (
  identifiers: string[],
  options: { ignore: string[] },
) => Promise<Array<IFile>>;

interface IVector {
  id: string;
  metadata?: IMetaData;
}

export interface IUpsertVectorOptions {
  namespace: string;
  vectors: IVector[];
}

export interface IQueryOptions {
  embedding: Array<number>;
  namespace: string;
}

export abstract class VectorDatabase {
  public abstract upsertVectors(options: IUpsertVectorOptions): Promise<number>;
  public abstract query(options: IQueryOptions): Promise<IMetaData[]>;
}

export interface IDocumentSection {
  header?: string;
  content: string;
  tags?: string[];
}

export interface IParsedDocument {
  title?: string;
  sections: IDocumentSection[];
}

export type DocumentParser = (
  document: Buffer | string,
  maxLength: number,
) => IParsedDocument;
export type AsyncDocumentParser = (
  document: Buffer | string,
  maxLength: number,
) => Promise<IParsedDocument>;
