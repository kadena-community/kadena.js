export interface RushConfig {
  projects: Array<{
    packageName: string;
    projectFolder: string;
    tags: string[];
    shouldPublish: boolean;
  }>;
}
