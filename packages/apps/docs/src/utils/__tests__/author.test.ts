import { getInitials } from '../author';

describe('getInitials', () => {
  it('should return the intial of the firstname if lastname is not given', () => {
    expect(getInitials('he-man')).toEqual('H');
  });
  it('should return the intials of firstname and lastname', () => {
    expect(getInitials('he-man skeletor')).toEqual('HS');
  });

  it('should return the 2 char initial if name is longer', () => {
    expect(getInitials('he-man master of the universe')).toEqual('HU');
  });
});
