import { PactNumber } from '@kadena/pactjs';
import { IGuard } from '../account/account.repository';
import { hasSameGuard } from '../account/account.service';
import { UUID } from '../types';
import { activityRepository } from './activity.repository';

export async function getTransferActivities(
  profileId?: string,
  guard?: IGuard,
  networkUUID?: UUID,
) {
  if (!guard || !networkUUID || !profileId) return [];
  return activityRepository
    .getAllActivities(profileId, networkUUID)
    .then((activities) =>
      activities
        .filter(
          (a) => a.type === 'Transfer' && hasSameGuard(a.account.guard, guard),
        )
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
