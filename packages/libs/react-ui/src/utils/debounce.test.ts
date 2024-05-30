import { describe, expect, it, vi } from 'vitest';
import { debounce } from './debounce';

vi.useFakeTimers();

describe('debounce', () => {
  it('should call the function only once after the wait time', () => {
    const mockFunction = vi.fn();
    const debouncedFunction = debounce(mockFunction, 1000);

    debouncedFunction();
    debouncedFunction();
    debouncedFunction();

    expect(mockFunction).not.toBeCalled();

    vi.runAllTimers();

    expect(mockFunction).toBeCalledTimes(1);
  });
});
