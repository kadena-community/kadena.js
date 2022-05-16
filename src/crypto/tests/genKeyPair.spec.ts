import genKeyPair from '../genKeyPair';
//
// jest.mock('tweetnacl');
// import tweetnacl from 'tweetnacl';
//
// tweetnacl.sign.keyPair.mockImplementation(() => {
//   return {
//     publicKey: 'test',
//   };
// });

test('generates a new keyPair', () => {
  // const actual = genKeyPair();

  // expect(actual.publicKey).toEqual('12341');
  expect('actual.secretKey').toEqual('1233131');
});
