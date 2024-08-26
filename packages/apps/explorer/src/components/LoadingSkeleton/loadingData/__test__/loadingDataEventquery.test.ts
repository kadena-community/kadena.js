import type { EventsQuery } from '@/__generated__/sdk';
import { loadingEventData } from '../loadingDataEventquery';

describe('loading data', () => {
  describe('loadingDataEventquery', () => {
    it('should return the correct type', () => {
      expectTypeOf(loadingEventData).toBeObject();

      expectTypeOf(loadingEventData).toMatchTypeOf<EventsQuery['events']>();
    });
  });
  describe('loadingDataBlockquery', () => {
    it('should return the correct type', () => {
      expectTypeOf(loadingEventData).toBeObject();

      expectTypeOf(loadingEventData).toMatchTypeOf<EventsQuery['events']>();
    });
  });
});
