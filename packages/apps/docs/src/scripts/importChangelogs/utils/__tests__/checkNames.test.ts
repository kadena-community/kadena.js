import { VersionPosition } from '../../constants';
import {
  checkMinorNames,
  checkPatchNames,
  checkVersionPosition,
} from '../checkNames';

describe('checkNames utils', () => {
  describe('checkVersionPosition', () => {
    it('should return VersionPosition.PATCH if value is a patch value', () => {
      expect(checkVersionPosition('tests')).toEqual(VersionPosition.PATCH);
      expect(checkVersionPosition('patch changes')).toEqual(
        VersionPosition.PATCH,
      );
    });
    it('should return VersionPosition.MINOR if value is a minor value', () => {
      expect(checkVersionPosition('features')).toEqual(VersionPosition.MINOR);
    });
    it('should return VersionPosition.MISC if value is neither a minor or patch value', () => {
      expect(checkVersionPosition('skeletor')).toEqual(VersionPosition.MISC);
    });
  });
  describe('checkPatchNames', () => {
    it('should return true if the header indicates patch content', () => {
      expect(checkPatchNames('bugfixes')).toBe(true);
      expect(checkPatchNames('tests')).toBe(true);
    });
    it('should return false if the header does NOT indicate patch content', () => {
      expect(checkPatchNames('skeletor')).toBe(false);
    });
  });
  describe('checkMinorNames', () => {
    it('should return true if the header indicates minor content', () => {
      expect(checkMinorNames('minor changes')).toBe(true);
      expect(checkMinorNames('features')).toBe(true);
    });
    it('should return false if the header does NOT indicate minor content', () => {
      expect(checkMinorNames('he-man')).toBe(false);
    });
  });
});
