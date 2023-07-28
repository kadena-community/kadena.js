interface ISearchResult {
  id: string;
  score?: number;
  filePath: string;
  content?: string;
  title: string;
  description: string;
}

interface IResponseError {
  status: number;
  message: string;
}

interface IScoredVectorMetaData {
  filePath: string;
  content: string;
}

interface IFrontmatterData {
  title?: string;
  description?: string;
}
