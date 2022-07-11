import { unique } from '../unique';

test('Takes in an array of hashes and remove duplicate', () => {
  const cmdHashes = [
    'NjduEShgzrjEmAVhprS85hst7mvCqOo6qjGH5j5WHro',
    'uolsidh4DWN-D44FoElnosL8e5-cGCGn_0l2Nct5mq8',
    'uolsidh4DWN-D44FoElnosL8e5-cGCGn_0l2Nct5mq8',
  ];

  const actual = unique(cmdHashes);
  const expected = [
    'NjduEShgzrjEmAVhprS85hst7mvCqOo6qjGH5j5WHro',
    'uolsidh4DWN-D44FoElnosL8e5-cGCGn_0l2Nct5mq8',
  ];

  expect(expected).toEqual(actual);
});

test('Takes in an array of unique hashes and return unique hashes', () => {
  const cmdHashes = [
    'NjduEShgzrjEmAVhprS85hst7mvCqOo6qjGH5j5WHro',
    'uolsidh4DWN-D44FoElnosL8e5-cGCGn_0l2Nct5mq8',
  ];

  const actual = unique(cmdHashes);
  const expected = [
    'NjduEShgzrjEmAVhprS85hst7mvCqOo6qjGH5j5WHro',
    'uolsidh4DWN-D44FoElnosL8e5-cGCGn_0l2Nct5mq8',
  ];

  expect(expected).toEqual(actual);
});
