import type { SearchClient } from 'algoliasearch';
import algoliasearch from 'algoliasearch';
import type { IMetaData } from '../../shared/index.js';
import { ALGOLIA_API_KEY, ALGOLIA_APP_ID, ALGOLIA_INDEX_NAME } from '../env.js';
import type {
  IQueryOptions,
  IUpsertVectorOptions,
  VectorDatabase,
} from '../types.js';

interface IMetaDataHit extends IMetaData {
  metadata: Record<string, unknown>;
}

export class Algolia implements VectorDatabase {
  private _appId: string;
  private _apiKey: string;
  private _indexName: string;
  private _client?: SearchClient;

  public constructor() {
    if (!ALGOLIA_APP_ID)
      throw new Error('Missing ALGOLIA_APP_ID environment variable');
    if (!ALGOLIA_API_KEY)
      throw new Error('Missing ALGOLIA_API_KEY environment variable');
    if (!ALGOLIA_INDEX_NAME)
      throw new Error('Missing ALGOLIA_INDEX_NAME environment variable');
    this._appId = ALGOLIA_APP_ID;
    this._apiKey = ALGOLIA_API_KEY;
    this._indexName = ALGOLIA_INDEX_NAME;
  }

  public setClient(): void {
    // @ts-ignore This expression is not callable, ts(2349)
    const client = algoliasearch(this._appId, this._apiKey);
    this._client = client;
  }

  public getClient(): SearchClient | undefined {
    if (!this._client) this.setClient();
    return this._client;
  }

  public getIndex(): ReturnType<SearchClient['initIndex']> | undefined {
    const _client = this.getClient();
    return _client?.initIndex(this._indexName);
  }

  public async upsertVectors({
    vectors,
  }: IUpsertVectorOptions): Promise<number> {
    const index = this.getIndex();
    if (!index) return 0;

    const objects = vectors.map((v) => ({ objectID: v.id, ...v.metadata }));
    const { objectIDs } = await index.saveObjects(objects);
    return objectIDs.length;
  }

  public async query({ embedding }: IQueryOptions): Promise<IMetaData[]> {
    const index = this.getIndex();
    if (!index) return [];
    const { hits } = await index.search<IMetaDataHit>(embedding.join(','));
    return hits.map((hit) => ({
      filePath: hit.filePath,
      url: hit.url,
      content: hit.content,
      title: hit.title,
      ...hit.metadata,
    }));
  }
}
