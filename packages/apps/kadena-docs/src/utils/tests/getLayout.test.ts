import { getLayout } from '..';

//@TODO: remove this, this is just for testing purposes, see that everything works
describe('utils getLayout', () => {
  test('should return layout Code-Component when arg is "code" or "codeside"', () => {
    expect(getLayout('code').displayName).toEqual('CodeSide');
    expect(getLayout('codeside').displayName).toEqual('CodeSide');
  });
  test('should return layout Full-Component when arg is anything', () => {
    expect(getLayout('full').displayName).toEqual('Full');
    expect(getLayout('he-man').displayName).toEqual('Full');
  });
  test('should return layout Landing-Component when arg is "landing"', () => {
    expect(getLayout('landing').displayName).toEqual('Landing');
  });
});
