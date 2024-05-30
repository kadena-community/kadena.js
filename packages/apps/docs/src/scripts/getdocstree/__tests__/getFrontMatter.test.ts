import type { IBasePageMeta } from '@kadena/docs-tools';
import { errors } from '../constants';
import { getFrontMatter } from '../utils/getFrontMatter';

describe('getFrontMatter', () => {
  it('should return frontmatter object when the first part of the markdown is yaml', () => {
    const markdown = `---
title: 'Explore the blockchain'
description: 'Add your name to the Kadena Memory Wall on the public blockchain, see the blockchain in action using a block explorer, and create a wallet on the test network to play a game.'
menu: Build
label: 'Explore the blockchain'
order: 1
layout: full
---

# Explore the blockchain

If you've never used an application that runs on a blockchain, you might wonder how the experience differs from using any other web-based or cloud-based application. After all, the backbone of any public blockchain is still the internet. In many ways, the experience from a user perspective can be—or should be—completely transparent. However, what makes a blockchain unique—keeping a permanent and tamper-proof record of every transaction—requires resources and resource constraints that other applications running on the internet don't typically need to address.`;

    const result = getFrontMatter(markdown, 'he-man.md');
    const expectedResult: IBasePageMeta = {
      description:
        'Add your name to the Kadena Memory Wall on the public blockchain, see the blockchain in action using a block explorer, and create a wallet on the test network to play a game.',
      label: 'Explore the blockchain',
      layout: 'full',
      menu: 'Build',
      order: 1,
      title: 'Explore the blockchain',
    };

    expect(result).toEqual(expectedResult);
    expect(errors.length).toEqual(0);
  });

  it('should return undefined when the first part of the markdown is not yaml', () => {
    const markdown = `# Explore the blockchain

If you've never used an application that runs on a blockchain, you might wonder how the experience differs from using any other web-based or cloud-based application. After all, the backbone of any public blockchain is still the internet. In many ways, the experience from a user perspective can be—or should be—completely transparent. However, what makes a blockchain unique—keeping a permanent and tamper-proof record of every transaction—requires resources and resource constraints that other applications running on the internet don't typically need to address.`;

    const result = getFrontMatter(markdown, 'he-man.md');

    expect(result).toEqual(undefined);
    expect(errors.length).toEqual(1);
    expect(errors[0]).toEqual('he-man.md: there is no frontmatter found');
  });
});
