import { refactorAbsoluteDocsLink } from '../../refactorAbsoluteDocsLink';

describe('utils refactorAbsoluteDocsLink', () => {
  it('should return the normal link if not absolute docs link', async () => {
    const start = 'https://he-man.com/masters-of-the-universe';
    const expectedResult = start;
    expect(refactorAbsoluteDocsLink(start)).toBe(expectedResult);
  });
  it('should return relative link if it is a docs link', async () => {
    let start = 'https://docs.kadena.io/build/start';
    let expectedResult = '/build/start';
    expect(refactorAbsoluteDocsLink(start)).toBe(expectedResult);

    start = 'https://docs.kadena.io/build/start.md';
    expectedResult = '/build/start.md';
    expect(refactorAbsoluteDocsLink(start)).toBe(expectedResult);

    start = 'https://docs.kadena.io/build/start.md';
    expectedResult = '/build/start.md';
    expect(refactorAbsoluteDocsLink(start)).toBe(expectedResult);
  });

  it('should return relative link if it is a docs link home', async () => {
    let start = 'https://docs.kadena.io';
    let expectedResult = '/';
    expect(refactorAbsoluteDocsLink(start)).toBe(expectedResult);

    start = 'https://docs.kadena.io/';
    expectedResult = '/';
    expect(refactorAbsoluteDocsLink(start)).toBe(expectedResult);

    start = 'http://docs.kadena.io/';
    expectedResult = '/';
    expect(refactorAbsoluteDocsLink(start)).toBe(expectedResult);
  });
});
