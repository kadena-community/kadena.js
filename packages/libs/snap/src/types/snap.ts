export type SnapRequest = {
  method: string;
  params: Record<string, unknown>;
};

export type Snap = {
  request: (request: SnapRequest) => Promise<unknown>;
};
