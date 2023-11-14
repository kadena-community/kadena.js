import Cookies from 'js-cookie';
import { describe, expect, test, vi } from 'vitest';
import * as persist from '../persist';

describe('getName', () => {
  test('getting a prefixed name', () => {
    const value = 'myCookie';
    const result = persist.getName(value);
    expect(result).toBe('_persist:myCookie');
  });
});

describe('getItem', () => {
  test('get cookie item', () => {
    const getSpy = vi
      .spyOn(Cookies, 'get')
      .mockReturnValueOnce({ '_persist:myCookie': 'omnomnom' });
    const cookieName = 'myCookie';
    persist.getItem(cookieName);

    expect(getSpy).toBeCalledWith('_persist:myCookie');
    getSpy.mockRestore();
  });
});

describe('purge', () => {
  test('remove cookies', () => {
    vi.spyOn(persist, 'getItems').mockImplementation(() => ({
      cookie: 'some_random_cookie',
    }));

    vi.spyOn(persist, 'deleteItem').mockImplementation(() => {});

    const result = persist.purge();
    expect(result).toBeTypeOf('undefined');
  });
});
