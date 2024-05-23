import { checkImagesContent } from '../utils/checkImagesContent';

const content = `
---
title: Consensus
id: concepts
description: Learn the basics about consensus models and the Kadena proof-of-work protocol.
menu: Learn
label: Consensus
order: 3
layout: full
tags: [pact, typescript, account, transactions, utils]
---

# Consensus

Introduction to different consensus models and fork choice rules.

Because a blockchain is a decentralized and distributed network of computers, there's no central authority that determines which transactions to process and the order in which transactions are executed. 
However, 
![Longest chain rule](/assets/docs/he-man.png)
all of the nodes that participate in the network need to have a consistent view of the current state of the blockchain.
To come to this consistent view, blockchains used a variety of consensus methods and consensus algorithms to determine the current state of ledger and to align of all the nodes to recognize the same blockchain state. 

`;

describe('checkImagesContent', () => {
  it('should return true if the image is in the content', async () => {
    const asset: IASSET = {
      path: './public/assets/docs/he-man.png',
      isUsed: false,
    };
    const assets: IASSET[] = [
      {
        path: './public/assets/docs/skeletor.png',
        isUsed: false,
      },
      {
        path: './public/assets/docs/greyskull.png',
        isUsed: false,
      },
      asset,
      {
        path: './public/assets/docs/cringer.png',
        isUsed: false,
      },
    ];

    checkImagesContent(content, assets);
    expect(asset.isUsed).toEqual(true);
    expect(assets.filter((a) => a.isUsed).length).toEqual(1);
  });
});
