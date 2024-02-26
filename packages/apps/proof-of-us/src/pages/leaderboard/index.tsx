'use client';

import { List } from '@/components/List/List';
import { ScreenHeight } from '@/components/ScreenHeight/ScreenHeight';
import { TitleHeader } from '@/components/TitleHeader/TitleHeader';
import UserLayout from '@/components/UserLayout/UserLayout';
import { useLeaderboard } from '@/hooks/data/leaderboard';
import { Stack } from '@kadena/react-ui';
import type { FC } from 'react';

const Page: FC = () => {
  const { data } = useLeaderboard();
  return (
    <UserLayout>
      <ScreenHeight>
        <Stack flexDirection="column" flex={1}>
          <TitleHeader label="Leaderbord" />
          <Stack flex={1}>
            <List>
              {data.map((account) => (
                <li key={account.accountName}>
                  {account.alias} ({account.tokenCount})
                </li>
              ))}
            </List>
          </Stack>
        </Stack>
      </ScreenHeight>
    </UserLayout>
  );
};

export default Page;
