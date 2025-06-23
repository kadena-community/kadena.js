import { OrganisationContext } from '@/contexts/OrganisationContext/OrganisationContext';
import { renderHook } from '@testing-library/react-hooks';
import { useContext } from 'react';
import { useOrganisation } from '../organisation';

const mocks = vi.hoisted(() => ({
  useContext: vi.fn(),
}));

const mockContext = vi.hoisted(() => ({
  organisation: {
    id: 'org-123',
    name: 'Test Organisation',
    domains: [{ value: 'test.org' }],
    sendEmail: 'contact@test.org',
  },
}));

describe('useOrganisation', () => {
  beforeEach(() => {
    // Mock React's useContext
    vi.mock('react', async () => {
      const actual = await vi.importActual('react');
      return {
        ...actual,
        useContext: mocks.useContext,
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should throw an error when used outside of OrganisationContextProvider', async () => {
    // Mock useContext to return null
    vi.mocked(mocks.useContext).mockReturnValueOnce(null);

    // The function should throw an error
    expect(() => {
      const { result } = renderHook(() => useOrganisation());
      return result.current;
    }).toThrow(
      'useOrganisation must be used within a OrganisationContextProvider',
    );

    // Verify useContext was called with OrganisationContext
    expect(useContext).toHaveBeenCalledWith(OrganisationContext);
  });

  it('should provide access to all organisation context properties', () => {
    // Setup context with organisation data
    vi.mocked(mocks.useContext).mockReturnValueOnce(
      mockContext as unknown as ReturnType<typeof useOrganisation>,
    );

    const { result } = renderHook(() => useOrganisation());

    // Verify properties
    expect(result.current.organisation).toBe(mockContext.organisation);
    expect(result.current.organisation?.id).toBe('org-123');
    expect(result.current.organisation?.name).toBe('Test Organisation');
    expect(result.current.organisation?.domains).toEqual([
      { value: 'test.org' },
    ]);
    expect(result.current.organisation?.sendEmail).toBe('contact@test.org');
  });
});
