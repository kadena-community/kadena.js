export type AppState = 'editing' | 'deploying' | 'done' | 'canceled';

export type Project = {
  type: string;
  name: string;
  dir: string;
  description: string;
  repoUrl: string;
  shouldPublish: boolean;
};
