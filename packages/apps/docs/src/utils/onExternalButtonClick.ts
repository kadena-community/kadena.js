import { analyticsEvent, EVENT_NAMES } from '@/utils/analytics';

export default function onExternalButtonClick(href: string): void {
  if (href.includes('twitter.com') || href.includes('x.com')) {
    analyticsEvent(EVENT_NAMES['click:open_twitter']);
  }

  if (href.includes('github.com')) {
    analyticsEvent(EVENT_NAMES['click:open_github']);
  }

  if (href.includes('linkedin.com')) {
    analyticsEvent(EVENT_NAMES['click:open_linkedin']);
  }

  if (href.includes('kadena.io/newsletter')) {
    analyticsEvent(EVENT_NAMES['click:newsletter']);
  }
}
