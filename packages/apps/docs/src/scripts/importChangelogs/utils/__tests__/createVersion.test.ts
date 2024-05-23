import type { Heading } from 'mdast';
import { createVersion } from '../createVersion';

describe('createVersion util', () => {
  it('should return a version object with the header value as label', () => {
    const header: Heading = {
      type: 'heading',
      depth: 2,
      children: [{ type: 'text', value: '2.0.0' }],
      position: {
        start: { line: 654, column: 1, offset: 22000 },
        end: { line: 655, column: 4, offset: 22009 },
      },
    };

    const result = createVersion(header);
    const expectedResult: IChangelogPackageVersion = {
      label: '2.0.0',
      isLocked: false,
      authors: [],
      patches: [],
      minors: [],
      miscs: [],
    };

    expect(result).toEqual(expectedResult);
  });
});
