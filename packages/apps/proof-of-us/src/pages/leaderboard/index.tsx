'use client';

import { List } from '@/components/List/List';
import { ScreenHeight } from '@/components/ScreenHeight/ScreenHeight';
import { TitleHeader } from '@/components/TitleHeader/TitleHeader';
import UserLayout from '@/components/UserLayout/UserLayout';
import { useLeaderboard } from '@/hooks/data/leaderboard';
import { Stack } from '@kadena/react-ui';
import { motion } from 'framer-motion';
import type { FC } from 'react';

const spring = {
  type: 'spring',
  damping: 9,
  stiffness: 120,
};

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
                <motion.li key={account.accountName} layout transition={spring}>
                  {account.alias} ({account.tokenCount})
                </motion.li>
              ))}
            </List>
          </Stack>
        </Stack>
      </ScreenHeight>
    </UserLayout>
  );
};

export default Page;
