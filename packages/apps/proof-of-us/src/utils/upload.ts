interface INFTUrl {
  url: string;
  data: {
    cid: string;
  };
}

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

  return {
    url: imageData.url,
    data: {
      cid: imageData.cid,
    },
  };
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

  return {
    url: metadata.url,
    data: {
      cid: metadata.cid,
    },
  };

  // const metadataFileName = 'metadata';
  // const metadata = await NFTStorage.encodeDirectory([
  //   new File([JSON.stringify(manifest, null, 2)], metadataFileName),
  // ]);

  // const metadataUrl = uri
  //   ? uri
  //   : `https://${metadata.cid.toString()}.ipfs.nftstorage.link/${metadataFileName}`;

  // console.log('metadata cid', metadata.cid.toString());
  // console.log('metadata url', metadataUrl);

  // return { data: metadata, url: metadataUrl };
};
