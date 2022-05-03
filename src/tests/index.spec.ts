import message from '../index';

test('check if message add the text hello', () => {
  expect(message('Kadena')).toEqual('Hello, Kadena!');
});
