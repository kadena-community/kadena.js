import {
  IGetPhraseResponse,
  ISetPhraseResponse,
  ISetSecurityPhrase,
} from '@/service-worker/types';
import { sendMessageToServiceWorker } from '@/utils/service-worker-com';
import { fallbackSecurityService } from './fallback.service';

async function setSecurityPhrase({
  phrase,
  keepPolicy,
  ttl,
}: {
  phrase: string;
  keepPolicy: ISetSecurityPhrase['payload']['keepPolicy'];
  ttl?: number;
}) {
  const { result } = (await sendMessageToServiceWorker({
    action: 'setSecurityPhrase',
    payload: { phrase, keepPolicy, ttl },
  })) as ISetPhraseResponse;

  return { result };
}

async function getSecurityPhrase() {
  const { phrase } = (await sendMessageToServiceWorker({
    action: 'getSecurityPhrase',
  })) as IGetPhraseResponse;
  return phrase;
}

async function clearSecurityPhrase() {
  const { result } = (await sendMessageToServiceWorker({
    action: 'clearSecurityPhrase',
  })) as ISetPhraseResponse;

  return { result };
}

export const securityService = !navigator.serviceWorker.controller
  ? fallbackSecurityService()
  : { setSecurityPhrase, getSecurityPhrase, clearSecurityPhrase };
