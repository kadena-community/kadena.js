import { getItem } from '../getItem';

describe('getItem', () => {
  const item = {
    name: 'He-man',
    props: {
      pet: 'Cringer',
      hasThePower: true,
    },
  };
  it('should return the correct value if the key is found', () => {
    const result = getItem(item, 'props.pet');
    expect(result).toEqual('Cringer');

    const result2 = getItem(item, 'props');
    expect(result2).toEqual({
      pet: 'Cringer',
      hasThePower: true,
    });
  });
  it('should return undefined when item is not found', () => {
    const result = getItem(item, 'props.skeletor');
    expect(result).toEqual(undefined);
  });
  it('should return undefined when there is no item', () => {
    const result = getItem(undefined, 'props.skeletor');
    expect(result).toEqual(undefined);
  });
});
