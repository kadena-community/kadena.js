export interface ISideBarLayoutLocation {
  url: string;
  hash?: string;
  push: (url: string) => void;
}
