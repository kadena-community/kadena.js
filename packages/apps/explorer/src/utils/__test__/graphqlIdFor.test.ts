import { base64Encode, graphqlIdFor } from '../graphqlIdFor';

describe('graphqlIdFor', () => {
  describe('graphqlIdFor', () => {
    it('should return the encoded graphqlID for type and hash', () => {
      const result = graphqlIdFor(
        'ACCOUNT',
        'bWFzdGVycyBvZiB0aGUgdW5pdmVyc2U=',
      );
      const expectedResult =
        'QUNDT1VOVDpiV0Z6ZEdWeWN5QnZaaUIwYUdVZ2RXNXBkbVZ5YzJVPQ==';
      expect(result).toEqual(expectedResult);
    });
  });

  describe('base64Encode', () => {
    it('should return the correct encoded string', () => {
      const result = base64Encode('masters of the universe');
      const expectedResult = 'bWFzdGVycyBvZiB0aGUgdW5pdmVyc2U=';

      expect(result).toEqual(expectedResult);
    });
  });
});
