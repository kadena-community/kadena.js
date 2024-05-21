import { renderHook } from '@testing-library/react-hooks';
import { useWindowScroll } from './../useWindowScroll';

describe('useWindowScroll', () => {
  it('should return the values of the window scroll', () => {
    const { result } = renderHook(() => useWindowScroll());
    const [{ y }] = result.current;

    expect(y).toEqual(0);
  });

  it('should return the values of the window scroll when scrolled', () => {
    window.scrollTo(0, 100);
    const { result } = renderHook(() => useWindowScroll());
    const [{ y }] = result.current;

    expect(y).toEqual(100);
  });
});
