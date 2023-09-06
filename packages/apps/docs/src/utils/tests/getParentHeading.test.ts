import { getParentHeading } from '..';

import type { ISubHeaderElement } from '@/types/Layout';

describe('utils getParentHeading', () => {
  test('should return the parent H1 if the tag is H2"', () => {
    const root: ISubHeaderElement = { tag: 'h1', children: [] };
    const expectedResult = root;

    const newChild = { tagName: 'h2' } as unknown as HTMLHeadingElement;

    const result = getParentHeading(root, newChild);

    expect(result).toStrictEqual(expectedResult);
  });

  test('should return the parent H2 if the tag is H3', () => {
    const root: ISubHeaderElement = {
      tag: 'h1',
      children: [
        { tag: 'h2', title: 'Section 1', slug: 'section-1', children: [] },
      ],
    };
    const expectedResult = {
      tag: 'h2',
      title: 'Section 1',
      slug: 'section-1',
      children: [],
    };

    const newChild = { tagName: 'h3' } as unknown as HTMLHeadingElement;

    const result = getParentHeading(root, newChild);

    expect(result).toStrictEqual(expectedResult);
  });

  test('should return the parent H1 if the tag is H2 and there is already an H2 as a child', () => {
    const root: ISubHeaderElement = {
      tag: 'h1',
      children: [
        { tag: 'h2', title: 'Section 1', slug: 'section-1', children: [] },
      ],
    };
    const expectedResult = root;

    const newChild = { tagName: 'h2' } as unknown as HTMLHeadingElement;

    const result = getParentHeading(root, newChild);

    expect(result).toStrictEqual(expectedResult);
  });

  test('should return the last H2 if the tag is H2 and there is already an H2 as a child', () => {
    const root: ISubHeaderElement = {
      tag: 'h1',
      children: [
        { tag: 'h2', title: 'Section 1', slug: 'section-1', children: [] },
        {
          tag: 'h2',
          title: 'Section 2',
          slug: 'section-2',
          children: [
            {
              tag: 'h3',
              title: 'Section 2.1',
              slug: 'section-21',
              children: [],
            },
            {
              tag: 'h3',
              title: 'Section 2.2',
              slug: 'section-22',
              children: [],
            },
          ],
        },
      ],
    };
    const expectedResult = root;

    const newChild = { tagName: 'h2' } as unknown as HTMLHeadingElement;

    const result = getParentHeading(root, newChild);

    expect(result).toStrictEqual(expectedResult);
  });

  test('should return the last H3 if the tag is H4', () => {
    const root: ISubHeaderElement = {
      tag: 'h1',
      children: [
        { tag: 'h2', title: 'Section 1', slug: 'section-1', children: [] },
        {
          tag: 'h2',
          title: 'Section 2',
          slug: 'section-2',
          children: [
            {
              tag: 'h3',
              title: 'Section 2.1',
              slug: 'section-21',
              children: [],
            },
            {
              tag: 'h3',
              title: 'Section 2.2',
              slug: 'section-22',
              children: [],
            },
          ],
        },
      ],
    };
    const expectedResult = {
      tag: 'h3',
      title: 'Section 2.2',
      slug: 'section-22',
      children: [],
    };

    const newChild = { tagName: 'h4' } as unknown as HTMLHeadingElement;

    const result = getParentHeading(root, newChild);

    expect(result).toStrictEqual(expectedResult);
  });
});
