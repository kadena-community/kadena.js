import { cleanAnchors } from '../validateMarkdownHashLinks';

describe('validateMarkdownHashLinks', () => {
  describe('cleanAnchors', () => {
    const arrayOfHashes = [
      '#operators',
      '#abs',
      '#basic-syntax',
      '#arguments',
      '#return-values',
      '#examples',
      '#add-',
      '#basic-syntax-1',
      '#arguments-1',
      '#return-value',
      '#examples-1',
      '#and',
    ];

    const cleanedArrayOfHashes = [
      '#operators',
      '#abs',
      '#basic-syntax',
      '#arguments',
      '#return-values',
      '#examples',
      '#add',
      '#basic-syntax',
      '#arguments',
      '#return-value',
      '#examples',
      '#and',
    ];

    it('should return the array of links as is, when the link already confirms to the regular expression', () => {
      const result = cleanAnchors('link-2')(arrayOfHashes);
      expect(result).toEqual(arrayOfHashes);
    });

    it('should return cleaned array of links, when the link does not confirm to the regular expression', () => {
      const result = cleanAnchors('link')(arrayOfHashes);
      expect(result).toEqual(cleanedArrayOfHashes);
    });
  });
});
