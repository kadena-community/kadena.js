import type { IRecord } from '../filterRemovedRecords';
import { filterRemovedRecords } from '../filterRemovedRecords';

describe('filterRemovedRecords utils', () => {
  describe('filterRemovedRecords', () => {
    it('should remove all records which have the isRemoved prop', () => {
      const accounts = [
        {
          requestKey: '1',
          accountName: 'k:he-man',
          creationTime: 0,
        },
        {
          requestKey: '2',
          accountName: 'skeletor',
          creationTime: 1,
        },
        {
          requestKey: '3',
          accountName: 'k:cringer',
          creationTime: 2,
          isRemoved: true,
        },
        {
          requestKey: '4',
          accountName: 'k:greyskull',
          creationTime: 3,
        },
      ] as IRecord[];

      const result = filterRemovedRecords(accounts);
      const expectedResult = [...accounts].toSpliced(2, 1);
      expect(result).toEqual(expectedResult);
      expect(result.length).toEqual(3);
    });
    it('should remove all double accounts from array', () => {
      const accounts = [
        {
          requestKey: '1',
          accountName: 'k:he-man',
          creationTime: 0,
        },
        {
          requestKey: '2',
          accountName: 'skeletor',
          creationTime: 1,
        },
        {
          requestKey: '3',
          accountName: 'k:cringer',
          creationTime: 2,
        },
        {
          requestKey: '4',
          accountName: 'k:he-man',
          creationTime: 3,
        },
      ] as IRecord[];

      const result = filterRemovedRecords(accounts);
      const expectedResult = [...accounts].toSpliced(3, 1);
      expect(result).toEqual(expectedResult);
      expect(result.length).toEqual(3);
    });
    it('should return the array when empty', () => {
      const result = filterRemovedRecords([]);
      expect(result).toEqual([]);
      expect(result.length).toEqual(0);
    });

    it('should sort the array on creationTime', () => {
      const accounts = [
        {
          requestKey: '1',
          accountName: 'k:he-man',
          creationTime: 0,
        },
        {
          requestKey: '2',
          accountName: 'skeletor',
          creationTime: 1,
        },
        {
          requestKey: '3',
          accountName: 'k:cringer',
          creationTime: 2,
        },
        {
          requestKey: '4',
          accountName: 'k:greyskull',
          creationTime: 1,
        },
      ] as IRecord[];

      const expectedResult = [
        accounts[0],
        accounts[1],
        accounts[3],
        accounts[2],
      ];

      const result = filterRemovedRecords(accounts);
      expect(result).toEqual(expectedResult);
      expect(result.length).toEqual(4);
    });
  });
});
