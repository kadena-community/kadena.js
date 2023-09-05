import { HeaderBuffer } from '../HeaderBuffer';
import type { IBufferHeader } from '../types';
/* ************************************************************************** */
/* HeaderBuffer */

function testHeaderBuffer(): boolean {
  const output: IBufferHeader[] = [];
  const hb = new HeaderBuffer(2, (x) => output.push(x));

  const hdr = (i: number): IBufferHeader => ({
    txCount: 0,
    header: {
      hash: `${i}`,
      parent: `${i - 1}`,
      height: i,
      nonce: '',
      creationTime: 0,
      adjacents: {},
      target: '',
      payloadHash: '',
      chainId: 0,
      weight: '',
      chainwebVersion: '',
      epochStart: 0,
      featureFlags: 0,
    },
    powHash: '',
    target: '',
  });

  for (let i = 10; i < 15; ++i) {
    hb.add(hdr(i));
  }

  // reorgg
  for (let i = 13; i < 17; ++i) {
    hb.add(hdr(i));
  }

  let a = 10;
  return output.every((x) => {
    const result = x.header.hash === String(a++);
    return result;
  });
}

const data1: IBufferHeader = {
  txCount: 0,
  header: {
    hash: 'h1',
    nonce: '16916480306891548596',
    creationTime: 1671629220030544,
    parent: 'jUYuT5ucNcY9wOf77IhuEw1niP2n3h1G3MdR6H7PXAk',
    adjacents: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '5': '_Ab4g11kyl2rnqBqZjvO-CiSmlf_yErs4hos6YULeac',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '10': 'XAfmr3TLWnWI2T2yj2osSFpXa5PIVqBY_YSpjw_3plE',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '15': 'AXX9ocmKxjayaah6rK7rVIkpsm2AzGbtI1B2jf41vdM',
    },
    target: 's_sYJULAtv3xvS72SXJ4gFsUPWZcIGTMPQAAAAAAAAA',
    payloadHash: 'jvstHn1mXqNjPqeGDGkEvtBN4yKy5JglL-BbVr-a76A',
    chainId: 0,
    weight: 'GRw1f8Mpviw1LwAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    height: 3306634,
    chainwebVersion: 'mainnet01',
    epochStart: 1671628208326429,
    featureFlags: 0,
  },
  powHash: '',
  target: '',
};

/* HeaderBuffer */

describe('HeaderBuffer', () => {
  it('should create a headerbuffer', () => {
    expect(testHeaderBuffer()).toBe(true);
  });

  it('should throw when headerbuffer has orphins', () => {
    const hb = new HeaderBuffer(2, (x) => {});
    const data2 = { ...data1, header: { ...data1.header, height: 3306633 } };
    try {
      hb.add(data1);
      hb.add(data2);
    } catch (err) {
      expect(err.message).toMatch(
        `HeaderBuffer: confirmation depth violation: block at height 3306633 got orphaned`,
      );
    }
  });

  it('should throw when chain is inconsistent at certain height', () => {
    const hb = new HeaderBuffer(2, (x) => {});
    const data2 = { ...data1, header: { ...data1.header, parent: 'h1' } };
    try {
      hb.add(data1);
      hb.add(data2);
    } catch (err) {
      expect(err.message).toMatch(
        `HeaderBuffer: inconsistent chain at height 3306634. Parent jUYuT5ucNcY9wOf77IhuEw1niP2n3h1G3MdR6H7PXAk doesn't match expected value h1`,
      );
    }
  });

  it('should throw when dept is violated and orphane found', () => {
    const hb = new HeaderBuffer(0, (x) => {});
    try {
      hb.add(data1);
    } catch (err) {
      expect(err.message).toMatch(
        `HeaderBuffer: confirmation depth violation: block at height 3306634 got orphane`,
      );
    }
  });

  it('should throw when block is missing', () => {
    const hb = new HeaderBuffer(-1, (x) => {});
    const data2 = {
      ...data1,
      header: { ...data1.header, parent: 'h1', height: 3306635 },
    };
    const data3 = {
      ...data1,
      header: { ...data1.header, parent: 'h1', height: 3306633 },
    };
    try {
      hb.add(data1);
      hb.add(data2);
      hb.add(data3);
    } catch (err) {
      expect(err.message).toMatch(
        `HeaderBuffer: missing block at height 3306635`,
      );
    }
  });
});
