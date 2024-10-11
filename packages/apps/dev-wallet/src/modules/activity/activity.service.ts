import { PactNumber } from '@kadena/pactjs';
import { UUID } from '../types';
import { activityRepository } from './activity.repository';

export async function getTransferActivities(
  keysetId?: string,
  networkUUID?: UUID,
) {
  console.log('getTransferActivities', keysetId, networkUUID);
  if (!keysetId || !networkUUID) return [];
  return activityRepository
    .getKeysetActivities(keysetId, networkUUID)
    .then((activities) =>
      activities
        .filter((a) => a.type === 'Transfer')
        .map((a) => ({
          ...a,
          data: {
            ...a.data,
            amount: a.data.transferData.receivers
              .reduce((acc, { amount }) => {
                return acc.plus(new PactNumber(amount));
              }, new PactNumber('0.0'))
              .toDecimal(),
          },
        })),
    );
}
