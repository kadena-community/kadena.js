import EventSource from 'eventsource';

export const buildEventSource = (url: string): EventSource => {
  return new EventSource(url, {});
};
