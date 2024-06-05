import { getData as getDataMocked } from './../../../mock/getData.mock';
import remarkFrontmatterToProps from './../../../remarkFrontmatterToProps';
import type { IFile, ITree } from './../../../types';

vi.mock('./../../../utils/staticGeneration/getData', () => {
  return {
    getData: async () => {
      return getDataMocked();
    },
  };
});

describe('remarkFrontmatterToProps', () => {
  it('should add the correct metadata frontmatter to the props of the page', async () => {
    const tree: ITree = {
      type: 'root',
      children: [
        {
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
          position: {},
        },
      ],
      position: {},
    } as unknown as ITree;

    const file: IFile = {
      data: {},
      messages: [],
      history: [
        '/Users/straatemans/Documents/projects/kadena/kadena.js/packages/apps/docs/src/pages/build/onboard/index.md',
      ],
      value:
        '---\n' +
        '\n' +
        "title: 'Explore the blockchain'\n" +
        "description: 'Add your name to the Kadena Memory Wall on the public blockchain, see the blockchain in action using a block explorer, and create a wallet on the test network to play a game.'\n" +
        '\n' +
        'menu: Build\n' +
        "label: 'Explore the blockchain'\n" +
        'order: 1\n' +
        'layout: full\n' +
        'tags: [chainweb, chainweaver, tutorial, resources]\n' +
        '\n' +
        '---\n' +
        '# Explore the blockchain\n' +
        '\n',
    };

    expect(tree.children.length).toBe(1);
    expect(tree.children[0].type).toBe('yaml');
    const resultFunc = remarkFrontmatterToProps();
    await resultFunc(tree, file);

    expect(tree.children.length).toBe(1);
    expect(tree.children[0].type).toBe('props');
  });
});
