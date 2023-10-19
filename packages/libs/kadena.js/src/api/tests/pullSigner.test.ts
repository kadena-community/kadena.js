import { pullSigner } from '../pullSigner';
import { keyPair } from './mockdata/execCommand';

describe('pullSigner', () => {
  it('Takes in a keyPair and outputs the public key', () => {
    const actual = pullSigner(keyPair);
    const expected = {
      pubKey:
        'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
    };

    expect(expected).toEqual(actual);
  });

  it('returns with clist', () => {
    const actual = pullSigner({ ...keyPair, clist: [] });
    const expected = {
      clist: [],
      pubKey:
        'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
    };

    expect(expected).toEqual(actual);
  });
});
