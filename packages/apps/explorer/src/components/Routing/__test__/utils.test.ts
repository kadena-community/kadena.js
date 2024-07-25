import { createHref, removeNetworkFromPath } from '../utils';
import { networkConstants as mockedNetworkConstants } from './../../../__mocks__/network.mock';

describe('routing utils', () => {
  describe('createHref', () => {
    it('should return the correct url if its just a # link', () => {
      const result = createHref(
        mockedNetworkConstants[0],
        mockedNetworkConstants,
        '#mastersoftheuniverse',
      );
      expect(result).toEqual('#mastersoftheuniverse');
    });
    it('should return the correct url with the correct network that exists IN the networks array', () => {
      const result = createHref(
        mockedNetworkConstants[0],
        mockedNetworkConstants,
        '/skeletor',
      );
      expect(result).toEqual('/heman/skeletor');

      const result2 = createHref(
        { ...mockedNetworkConstants[0], slug: 'cringer' },
        mockedNetworkConstants,
        '/skeletor',
      );
      expect(result2).toEqual('/cringer/skeletor');
    });
  });
  describe('removeNetworkFromPath', () => {
    it('should remove the network slug from the beginning of the long url', () => {
      const result = removeNetworkFromPath(
        '/heman/greyskull/master-of-the-universe',
        mockedNetworkConstants,
      );
      expect(result).toEqual('/greyskull/master-of-the-universe');
    });
    it('should remove the network slug from the beginning of the short url', () => {
      const result = removeNetworkFromPath('/heman', mockedNetworkConstants);
      expect(result).toEqual('/');
    });
    it('should remove the network slug from the beginning of the long url keep the hash', () => {
      const result = removeNetworkFromPath(
        '/heman/greyskull/master-of-the-universe?q=cringer#skeletor',
        mockedNetworkConstants,
      );
      expect(result).toEqual(
        '/greyskull/master-of-the-universe?q=cringer#skeletor',
      );
    });
    it('should remove the network slug from the beginning of the short url keep the hash', () => {
      const result = removeNetworkFromPath(
        '/heman?q=cringer#skeletor',
        mockedNetworkConstants,
      );
      expect(result).toEqual('/?q=cringer#skeletor');
    });
    it('should keep the url as is when it does not start with a network slug', () => {
      const result = removeNetworkFromPath(
        '/master-of-the-universe',
        mockedNetworkConstants,
      );
      expect(result).toEqual('/master-of-the-universe');

      const result2 = removeNetworkFromPath(
        '/skeletor?q=cringer#skeletor',
        mockedNetworkConstants,
      );
      expect(result2).toEqual('/skeletor?q=cringer#skeletor');
    });
  });
});
