import { afterEach, describe, expect, it, vi } from 'vitest';
import type { IOrganisation } from '../../../contexts/OrganisationContext/OrganisationContext';
import { OrganisationStore } from '../../store/organisationStore';

// Mocks for dependencies
vi.mock('../store/firebase', () => ({
  database: {},
}));
vi.mock('firebase/database', () => ({
  ref: vi.fn((db, path) => path),
  get: vi.fn(async () => ({
    toJSON: () => ({
      id: 'org1',
      name: 'Org',
      domains: { domain1: { value: 'domain1.com' } },
      sendEmail: 'test@org.com',
    }),
    key: 'org1',
  })),
  set: vi.fn(async () => {}),
}));
vi.mock('../getOriginKey', () => ({
  getOriginKey: (val: string) => val.replace(/\W/g, ''),
}));

global.fetch = vi.fn(async () => ({
  status: 200,
  json: async () => ({ organisationId: 'org1' }),
})) as any;

describe('OrganisationStore', () => {
  const mockOrg: IOrganisation = {
    id: 'org1',
    name: 'Org',
    domains: [{ value: 'domain1.com' }],
    sendEmail: 'test@org.com',
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns undefined if no organisationId and fetch fails', async () => {
    (global.fetch as any).mockImplementationOnce(async () => ({ status: 500 }));
    const store = await OrganisationStore();
    expect(store).toBeUndefined();
  });

  it('returns undefined if no organisationId and fetch throws', async () => {
    (global.fetch as any).mockImplementationOnce(async () => {
      throw new Error('fail');
    });
    const store = await OrganisationStore();
    expect(store).toBeUndefined();
  });

  it('returns undefined if no organisationId after fetch', async () => {
    (global.fetch as any).mockImplementationOnce(async () => ({
      status: 200,
      json: async () => ({}),
    }));
    const store = await OrganisationStore();
    expect(store).toBeUndefined();
  });

  it('returns store if organisationId is provided', async () => {
    const store = await OrganisationStore('org1');
    expect(store).toBeDefined();
    expect(typeof store?.getCurrentOrganisation).toBe('function');
  });

  it('getCurrentOrganisation returns organisation', async () => {
    const store = await OrganisationStore('org1');
    const org = await store?.getCurrentOrganisation();
    expect(org).toMatchObject({
      id: 'org1',
      name: 'Org',
      sendEmail: 'test@org.com',
    });
  });

  it('getOrganisations returns array of organisations', async () => {
    const { get } = await import('firebase/database');
    (get as any).mockImplementationOnce(async () => ({
      toJSON: () => ({
        org1: {
          name: 'Org',
          domains: { domain1: { value: 'domain1.com' } },
          sendEmail: 'test@org.com',
        },
        org2: {
          name: 'Org2',
          domains: { domain2: { value: 'domain2.com' } },
          sendEmail: 'test2@org.com',
        },
      }),
    }));
    const store = await OrganisationStore('org1');
    const orgs = await store?.getOrganisations();
    expect(orgs).toEqual([
      {
        name: 'Org',
        domains: { domain1: { value: 'domain1.com' } },
        sendEmail: 'test@org.com',
        id: 'org1',
      },
      {
        name: 'Org2',
        domains: { domain2: { value: 'domain2.com' } },
        sendEmail: 'test2@org.com',
        id: 'org2',
      },
    ]);
  });

  it('getOrganisation returns organisation with domains as array', async () => {
    const store = await OrganisationStore('org1');
    const org = await store?.getOrganisation();
    expect(org).toMatchObject({
      id: 'org1',
      name: 'Org',
      sendEmail: 'test@org.com',
      domains: [{ value: 'domain1.com' }],
    });
  });

  it('updateOrganisation calls set with correct params', async () => {
    const { set } = await import('firebase/database');
    const store = await OrganisationStore('org1');
    await store?.updateOrganisation(mockOrg);
    expect(set).toHaveBeenCalledWith(
      '/organisationsData/org1',
      expect.objectContaining({
        id: 'org1',
        name: 'Org',
        sendEmail: 'test@org.com',
        domains: { domain1com: { value: 'domain1.com' } },
      }),
    );
  });
});
