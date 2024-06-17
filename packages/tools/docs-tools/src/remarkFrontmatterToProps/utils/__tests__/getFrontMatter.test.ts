import { getFrontMatter } from '../getFrontMatter';
import type { DocsRootContent } from './../../../types';

describe('getFrontMatter', () => {
  it('should return an object from the given yaml', () => {
    const node: DocsRootContent = {
      type: 'yaml',
      value:
        '\n' +
        "title: 'Explore the blockchain'\n" +
        "description: 'Add your name to the Kadena Memory Wall on the public blockchain, see the blockchain in action using a block explorer, and create a wallet on the test network to play a game.'\n" +
        '\n' +
        'menu: Build\n' +
        "label: 'Explore the blockchain'\n" +
        'order: 1\n' +
        'layout: full\n' +
        'tags: [chainweb, chainweaver, tutorial, resources]\n',
      position: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 12, column: 4, offset: 349 },
      },
    };

    const result = getFrontMatter(node);
    expect(result).toEqual({
      description:
        'Add your name to the Kadena Memory Wall on the public blockchain, see the blockchain in action using a block explorer, and create a wallet on the test network to play a game.',
      label: 'Explore the blockchain',
      layout: 'full',
      menu: 'Build',
      order: 1,
      tags: ['chainweb', 'chainweaver', 'tutorial', 'resources'],
      title: 'Explore the blockchain',
    });
  });
});
