// Don't allow `null` values (not supported in Pinecone)
export interface IMetaData {
  filePath: string;
  url: string;
  content: string;
  title: string; // document title
  header?: string; // section header
  score?: number;
  tags?: string[];
}

export type StreamMetaData = Partial<IMetaData>;

export interface IUsage {
  prompt_tokens: number;
  completion_tokens?: number;
  total_tokens: number;
}

export interface IParams {
  query?: string;
  previousQueries?: string[];
  previousResponses?: string[];
  embedding_model?: string;
  completion_model?: string;
  stream?: boolean;
}

interface IBaseEventData {
  id: string;
  created: number;
  model: string;
}

interface IChatCompletionChoice {
  delta: {
    content: string;
  };
}

export interface IChatCompletionEventData extends IBaseEventData {
  object: 'chat.completion.chunk';
  choices: IChatCompletionChoice[];
}

interface ICompletionChoice {
  text: string;
  index: number;
  finish_reason: string;
}

export interface ICompletionEventData extends IBaseEventData {
  object: 'text_completion';
  choices: ICompletionChoice[];
}

export type EventData = ICompletionEventData | IChatCompletionEventData;
