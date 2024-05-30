import { pushToParent } from '../utils/pushToParent';

describe('pushToParent', () => {
  it('should return the parents with 2 objects', () => {
    const parents: IParent[] = [
      {
        children: [],
        root: '/learn/what-is-a-blockchain',
        lastModifiedDate: 'Mon, 27 May 2024 11:33:41 GMT',
        title: 'What is a blockchain?',
        subtitle: 'What is a blockchain?',
        description:
          'Introduces the basics of blockchain technology and terminology.',
        menu: 'Learn',
        label: 'What is a blockchain?',
        order: 1,
        layout: 'full',
        tags: ['pact', 'typescript', 'account', 'transactions', 'utils'],
        wordCount: 1125,
        readingTimeInMinutes: 6,
        isMenuOpen: false,
        isActive: false,
        isIndex: true,
      },
    ];
    const rootIdx = 1;
    const child: IParent = {
      children: [],
      root: '/learn/why-kadena',
      lastModifiedDate: 'Mon, 27 May 2024 11:33:41 GMT',
      title: 'Why Kadena',
      subtitle: 'why',
      description:
        'Highlights the unique properties of the Kadena blockchain network with a high level overview.',
      menu: 'Learn',
      label: 'Why Kadena',
      order: 1,
      layout: 'full',
      tags: ['pact', 'typescript', 'account', 'transactions', 'utils'],
      wordCount: 612,
      readingTimeInMinutes: 4,
      isMenuOpen: false,
      isActive: false,
      isIndex: true,
    };

    const expectedParents = [...parents];

    const result = pushToParent(parents, child, rootIdx);

    expectedParents[rootIdx] = child;
    expect(result).toEqual(expectedParents);
    expect(result.length).toEqual(2);
  });

  it('should return the parents with 1 object (the child object)', () => {
    const parents: IParent[] = [
      {
        children: [],
        root: '/learn/what-is-a-blockchain',
        lastModifiedDate: 'Mon, 27 May 2024 11:33:41 GMT',
        title: 'What is a blockchain?',
        subtitle: 'What is a blockchain?',
        description:
          'Introduces the basics of blockchain technology and terminology.',
        menu: 'Learn',
        label: 'What is a blockchain?',
        order: 1,
        layout: 'full',
        tags: ['pact', 'typescript', 'account', 'transactions', 'utils'],
        wordCount: 1125,
        readingTimeInMinutes: 6,
        isMenuOpen: false,
        isActive: false,
        isIndex: true,
      },
    ];
    const rootIdx = 0;
    const child: IParent = {
      children: [],
      root: '/learn/why-kadena',
      lastModifiedDate: 'Mon, 27 May 2024 11:33:41 GMT',
      title: 'Why Kadena',
      subtitle: 'why',
      description:
        'Highlights the unique properties of the Kadena blockchain network with a high level overview.',
      menu: 'Learn',
      label: 'Why Kadena',
      order: 1,
      layout: 'full',
      tags: ['pact', 'typescript', 'account', 'transactions', 'utils'],
      wordCount: 612,
      readingTimeInMinutes: 4,
      isMenuOpen: false,
      isActive: false,
      isIndex: true,
    };

    const result = pushToParent(parents, child, rootIdx);
    expect(result).toEqual([child]);
    expect(result.length).toEqual(1);
  });
});
