export async function isChainWebNodeOk(serviceUrl: string) {
  try {
    const res = await fetch(`${serviceUrl}/health-check`);
    if (res.ok) {
      const message = await res.text();
      if (message.includes('Health check OK.')) {
        return true;
      }
    }
  } catch (e) {
    // swallow
  }
  return false;
}

export async function isChainWebAtHeight(
  targetHeight: number,
  serviceUrl: string,
) {
  try {
    const res = await fetch(`${serviceUrl}/chainweb/0.0/development/cut`);
    if (res.ok) {
      const data = (await res.json()) as { height: number };
      const height = data.height;
      if (height >= targetHeight) {
        return true;
      }
      return false;
    }
  } catch (e) {
    // swallow
  }
  return false;
}

export interface MakeBlocksParams {
  count?: number;
  chainIds?: string[];
  onDemandUrl: string;
}
export async function makeBlocks({
  count = 1,
  chainIds = ['0'],
  onDemandUrl,
}: MakeBlocksParams) {
  const body = JSON.stringify(
    chainIds.reduce((acc, chainId) => ({ ...acc, [chainId]: count }), {}),
  );
  const res = await fetch(`${onDemandUrl}/make-blocks`, {
    method: 'POST',
    body: body,
  });
  if (res.ok) {
    const data = await res.json();
    return data;
  } else {
    throw new Error(`Failed to make blocks ${res.status} ${res.statusText}`);
  }
}

export async function didMakeBlocks(params: MakeBlocksParams) {
  try {
    await makeBlocks(params);
    return true;
  } catch (e) {
    return false;
  }
}
