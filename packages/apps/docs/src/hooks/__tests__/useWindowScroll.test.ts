import { fireEvent } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import { useWindowScroll } from './../useWindowScroll';

describe('useWindowScroll', () => {
  it('should return the values of the window scroll', () => {
    const { result } = renderHook(() => useWindowScroll());
    const [{ y }] = result.current;

    expect(y).toEqual(0);
  });

  it('should return the values of the window scroll when scrolled', async () => {
    window.scrollTo(0, 100);
    const { result } = renderHook(() => useWindowScroll());

    expect(result.current[0].y).toEqual(100);

    act(() => {
      fireEvent.scroll(window, { target: { scrollY: 300 } });
    });

    expect(result.current[0].y).toEqual(300);
  });
});
