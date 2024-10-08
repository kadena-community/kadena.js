import { PactNumber } from '@kadena/pactjs';
import { activityRepository } from './activity.repository';

export async function getTransferActivities(
  keysetId?: string,
  networkId?: string,
) {
  console.log('getTransferActivities', keysetId, networkId);
  if (!keysetId || !networkId) return [];
  return activityRepository
    .getKeysetActivities(keysetId, networkId)
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
