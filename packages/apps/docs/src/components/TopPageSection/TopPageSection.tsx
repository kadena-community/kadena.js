import { Stack } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';
import { EditPage } from '../BottomPageSection/components/EditPage';
import { LastModifiedDate } from '../LastModifiedDate/LastModifiedDate';

interface IProps {
  editLink?: string;
  lastModifiedDate?: Date;
}

export const TopPageSection: FC<IProps> = ({ editLink, lastModifiedDate }) => {
  return (
    <Stack width="100%" alignItems="center" justifyContent="space-between">
      <EditPage variant="transparent" isCompact={true} editLink={editLink} />

      <LastModifiedDate date={lastModifiedDate} />
    </Stack>
  );
};
