import {
  IGetPhraseResponse,
  ISetPhraseResponse,
  ISetSecurityPhrase,
} from '@/service-worker/types';
import { sendMessageToServiceWorker } from '@/utils/service-worker-com';
import { fallbackSecurityService } from './fallback.service';

async function setSecurityPhrase(payload: ISetSecurityPhrase['payload']) {
  const { result } = (await sendMessageToServiceWorker({
    action: 'setSecurityPhrase',
    payload,
  })) as ISetPhraseResponse;

  return { result };
}

async function getSecurityPhrase(sessionEntropy: string) {
  const { phrase } = (await sendMessageToServiceWorker({
    action: 'getSecurityPhrase',
    payload: { sessionEntropy },
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
