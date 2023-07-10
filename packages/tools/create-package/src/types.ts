export type AppState = 'editing' | 'deploying' | 'done' | 'canceled';

export interface IProject {
  type: string;
  name: string;
  dir: string;
  description: string;
  repoUrl: string;
  shouldPublish: boolean;
}
