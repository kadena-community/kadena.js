import { getLayout } from '../getLayout';

describe('utils getLayout', () => {
  it('should return layout Code-Component when arg is "code" or "codeside"', () => {
    expect(getLayout('redocly').displayName).toEqual('Redocly');
  });
  it('should return layout Full-Component when arg is anything', () => {
    expect(getLayout('full').displayName).toEqual('Full');
  });
  it('should return layout Landing-Component when arg is "landing"', () => {
    expect(getLayout('landing').displayName).toEqual('Landing');
    expect(getLayout('he-man').displayName).toEqual('Landing');
  });
});
