import { networkConstants } from '@/__mocks__/network.mock';
import type { IEditNetwork } from '@/constants/network';
import { defineNewNetwork, getFormValues, validateNewNetwork } from '../utils';

describe('selectnetwork utils', () => {
  describe('validateNewNetwork', () => {
    it('should return an error when network already exists and network is new', () => {
      const newNetwork = {
        networkId: 'greyskull',
        label: 'Skeletor',
        slug: 'heman',
        chainwebUrl: 'api.chainweb.com',
        graphUrl: 'https://graph.kadena.network/graphql',
        wsGraphUrl: 'https://graph.kadena.network/graphql',
        explorerUrl: 'https://explorer.kadena.io/',
        isNew: true,
      };

      const result = validateNewNetwork(networkConstants, newNetwork);
      expect(result.length).toEqual(1);
      expect(result[0]).toEqual('network already exists');
    });
    it('should NOT return an error when network already exists and network is NOT new', () => {
      const newNetwork = {
        networkId: 'greyskull',
        label: 'Skeletor',
        slug: 'heman',
        chainwebUrl: 'api.chainweb.com',
        graphUrl: 'https://graph.kadena.network/graphql',
        wsGraphUrl: 'https://graph.kadena.network/graphql',
        explorerUrl: 'https://explorer.kadena.io/',
        isNew: false,
      };
      const result = validateNewNetwork(networkConstants, newNetwork);
      expect(result.length).toEqual(0);
    });
    it('should return an error when required fields are empty', () => {
      const newNetwork = {
        networkId: '',
        label: '',
        slug: '',
        chainwebUrl: 'api.chainweb.com',
        graphUrl: 'https://graph.kadena.network/graphql',
        wsGraphUrl: 'https://graph.kadena.network/graphql',
        explorerUrl: 'https://explorer.kadena.io/',
        isNew: false,
      };
      const result = validateNewNetwork(networkConstants, newNetwork);
      expect(result.length).toEqual(3);
      expect(result[0]).toEqual("'networkId' is required");
    });
    it('should return no errors when network is valid', () => {
      const newNetwork = {
        networkId: 'greyskull',
        label: 'Skeletor',
        slug: 'skeletor',
        chainwebUrl: 'api.chainweb.com',
        graphUrl: 'https://graph.kadena.network/graphql',
        wsGraphUrl: 'https://graph.kadena.network/graphql',
        explorerUrl: 'https://explorer.kadena.io/',
        isNew: false,
      };
      const result = validateNewNetwork(networkConstants, newNetwork);
      expect(result.length).toEqual(0);
    });
  });

  describe('getFormValues', () => {
    it('should return an object of formvalues', () => {
      const formData: FormData = new FormData();
      formData.append('name', 'He-Man');
      formData.append('profession', 'Master of the Universe');
      formData.append('pet', 'Cringer');
      const expectedResult = {
        name: 'He-Man',
        profession: 'Master of the Universe',
        pet: 'Cringer',
      };

      const result = getFormValues(formData);

      expect(result).toEqual(expectedResult);
    });
  });
  describe('defineNewNetwork', () => {
    it('should return a new empty network', () => {
      const result = defineNewNetwork();
      const expectedResult: IEditNetwork = {
        networkId: '',
        label: '',
        slug: '',
        chainwebUrl: '',
        graphUrl: '',
        wsGraphUrl: '',
        isNew: true,
      };

      expect(result).toEqual(expectedResult);
    });

    it('should return a new empty network, with Prop isNew:true', () => {
      const result = defineNewNetwork();
      const expectedResult: IEditNetwork = {
        networkId: '',
        label: '',
        slug: '',
        chainwebUrl: '',
        graphUrl: '',
        wsGraphUrl: '',
        isNew: false,
      };

      expect(result).not.toEqual(expectedResult);
    });
  });
});
