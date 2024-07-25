import {
  EVENT_NAMES,
  analyticsEvent,
  analyticsPageView,
  updateConsent,
} from '../analytics';

describe('analytics', () => {
  beforeEach(() => {
    window.gtag = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('updateConsent', () => {
    it('should update the consent for gtag', () => {
      updateConsent(true);

      expect(window.gtag).toHaveBeenNthCalledWith(1, 'consent', 'update', {
        ad_storage: 'denied',
        analytics_storage: 'granted',
      });
    });

    it('should update the localstorage', () => {
      const localStorageSpy = vi.spyOn(localStorage, 'setItem');
      updateConsent(false);

      expect(window.gtag).toHaveBeenNthCalledWith(1, 'consent', 'update', {
        ad_storage: 'denied',
        analytics_storage: 'denied',
      });

      expect(localStorageSpy).toBeCalledTimes(1);
      expect(localStorageSpy).toBeCalledWith('cookie_consent', 'false');
    });

    it('should also console.warn when the nodeenv is development', () => {
      const consoleMock = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);
      vi.stubEnv('NODE_ENV', 'development');

      updateConsent(true);

      expect(window.gtag).toHaveBeenNthCalledWith(1, 'consent', 'update', {
        ad_storage: 'denied',
        analytics_storage: 'granted',
      });

      expect(consoleMock).toBeCalledWith('SET CONSENT', {
        value: 'granted',
      });
    });
  });

  describe('analyticsPageView', () => {
    it('should call analyticsPageView with correct props', () => {
      analyticsPageView({
        page_path: '/skeletor',
        send_to: '12345',
      });

      expect(window.gtag).toHaveBeenNthCalledWith(1, 'event', 'page_view', {
        page_path: '/skeletor',
        send_to: '12345',
      });
    });

    it('should also console.warn when the nodeenv is development', () => {
      const consoleMock = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);

      vi.stubEnv('NODE_ENV', 'development');

      analyticsPageView({
        page_path: '/skeletor',
        send_to: '12345',
      });

      expect(window.gtag).toHaveBeenNthCalledWith(1, 'event', 'page_view', {
        page_path: '/skeletor',
        send_to: '12345',
      });

      expect(consoleMock).toBeCalledWith('GTAG EVENT', {
        options: { page_path: '/skeletor', send_to: '12345' },
      });
    });
  });

  describe('analyticsEvent', () => {
    it('should call analyticsEvent with correct props', () => {
      analyticsEvent(EVENT_NAMES['click:add_network'], {
        label: 'Master of the universe',
        hash: '/he-man',
      });

      expect(window.gtag).toHaveBeenNthCalledWith(
        1,
        'event',
        'click:add_network',
        {
          hash: '/he-man',
          label: 'Master of the universe',
        },
      );
    });

    it('should also console.warn when the nodeenv is development', () => {
      const consoleMock = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);

      vi.stubEnv('NODE_ENV', 'development');
      analyticsEvent(EVENT_NAMES['click:add_network'], {
        label: 'Master of the universe',
        hash: '/he-man',
      });

      expect(consoleMock).toBeCalledWith('GTAG EVENT', {
        name: 'click:add_network',
        options: { hash: '/he-man', label: 'Master of the universe' },
      });
      expect(window.gtag).toHaveBeenNthCalledWith(
        1,
        'event',
        'click:add_network',
        {
          hash: '/he-man',
          label: 'Master of the universe',
        },
      );
    });
  });
});
