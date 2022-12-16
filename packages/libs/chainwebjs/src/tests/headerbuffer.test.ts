import { HeaderBuffer } from '../HeaderBuffer';
import { IBufferHeader } from '../types';
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
    // console.log("i:", i); console.log("buffer:", hb);
    hb.add(hdr(i));
  }

  // reorgg
  for (let i = 13; i < 17; ++i) {
    // console.log("i:", i); console.log("buffer:", hb);
    hb.add(hdr(i));
  }

  let a = 10;
  return output.every((x) => {
    const result = x.header.hash === String(a++);
    return result;
  });
}

test('HeaderBuffer', () => {
  expect(testHeaderBuffer()).toBe(true);
});
