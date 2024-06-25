interface INFTUrl {
  url: string;
  data: {
    cid: string;
  };
}

export interface IUploadResult {
  url: string;
  cid: string;
}

export const createHashData = (data: IUploadResult): INFTUrl => {
  return {
    url: data.url,
    data: {
      cid: data.cid,
    },
  };
};

export const createImageUrl = async (
  bg: string,
  proofOfUsId: string,
): Promise<INFTUrl | undefined> => {
  const mimeType = bg.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1];

  if (!mimeType) {
    return;
  }

  const res = await fetch('/api/uploadimage', {
    method: 'POST',
    body: JSON.stringify({ proofOfUsId }),
  });
  const imageData = await res.json();

  if (!imageData?.url) {
    return;
  }

  return createHashData(imageData);
};

export const createMetaDataUrl = async (
  manifest: any,
): Promise<INFTUrl | undefined> => {
  const res = await fetch('/api/uploadmeta', {
    method: 'POST',
    body: JSON.stringify({ manifest }),
  });
  const metadata = await res.json();

  if (!metadata?.url) {
    return;
  }

  return createHashData(metadata);
};
