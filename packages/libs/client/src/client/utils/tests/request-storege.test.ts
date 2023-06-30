import { getRequestStorage } from '../request-storege';

describe('getRequestStorage', () => {
  it('create a storage with initial value', () => {
    const storage = getRequestStorage(new Map([['req-1', 'http://host-url']]));
    expect(storage.get('req-1')).toBe('http://host-url');
  });

  it('adds several items to the storage by using add method', () => {
    const storage = getRequestStorage();
    storage.add('http://host-url', ['req-1', 'req-2']);
    expect(storage.getByHost('http://host-url')).toEqual(['req-1', 'req-2']);
  });

  it('removes items by calling remove method', () => {
    const storage = getRequestStorage();
    storage.add('http://host-url', ['req-1', 'req-2']);
    storage.remove(['req-1']);
    expect(storage.getByHost('http://host-url')).toEqual(['req-2']);
  });

  it('returns items grouped by host by calling groupByHost method', () => {
    const storage = getRequestStorage();
    storage.add('http://host-url-1', ['req-1', 'req-2']);
    storage.add('http://host-url-2', ['req-3', 'req-4']);
    expect(storage.groupByHost()).toEqual([
      ['http://host-url-1', ['req-1', 'req-2']],
      ['http://host-url-2', ['req-3', 'req-4']],
    ]);
  });
});
