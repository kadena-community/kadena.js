'use client';

import { List } from '@/components/List/List';
import { ScreenHeight } from '@/components/ScreenHeight/ScreenHeight';
import { TitleHeader } from '@/components/TitleHeader/TitleHeader';
import { Heading } from '@/components/Typography/Heading';
import UserLayout from '@/components/UserLayout/UserLayout';
import { useLeaderboard } from '@/hooks/data/leaderboard';
import {
  accountNameClass,
  amountClass,
  itemsContainerClass,
  listCounterClass,
  listItemClass,
  winnerClass,
} from '@/styles/leaderboard.css';
import { Stack } from '@kadena/react-ui';
import cn from 'classnames';
import { motion } from 'framer-motion';
import type { FC } from 'react';

const spring = {
  type: 'spring',
  damping: 9,
  stiffness: 120,
};

const Page: FC = () => {
  const { data } = useLeaderboard();
  const winner = data[0];
  const rest = data.slice(1);

  return (
    <UserLayout>
      <ScreenHeight>
        <Stack flexDirection="column" flex={1} className={listCounterClass}>
          <Stack marginBlockEnd="lg">
            <TitleHeader label="Leaderboard" />
          </Stack>
          <Heading as="h6">The Platinum Connector</Heading>
          {winner && (
            <Stack
              marginBlockStart="sm"
              marginBlockEnd="lg"
              alignItems="center"
            >
              <List>
                <motion.li
                  key={winner.accountName}
                  layout
                  transition={spring}
                  className={cn(listItemClass, winnerClass)}
                >
                  <Stack
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="space-between"
                    className={itemsContainerClass}
                  >
                    <div>
                      {winner.alias}
                      <div className={accountNameClass}>
                        {winner.accountName}
                      </div>
                    </div>
                    <div className={amountClass}>{winner.tokenCount}</div>
                  </Stack>
                </motion.li>
              </List>
            </Stack>
          )}
          <Heading as="h6">Golden Connectors</Heading>
          {rest && (
            <Stack marginBlockStart="sm">
              <List>
                {rest.map((account) => (
                  <motion.li
                    key={account.accountName}
                    layout
                    transition={spring}
                    className={listItemClass}
                  >
                    <Stack
                      display="inline-flex"
                      justifyContent="space-between"
                      className={itemsContainerClass}
                      alignItems="center"
                    >
                      <div>
                        {account.alias}
                        <div className={accountNameClass}>
                          {account.accountName}
                        </div>
                      </div>
                      <div className={amountClass}>{account.tokenCount}</div>
                    </Stack>
                  </motion.li>
                ))}
              </List>
            </Stack>
          )}
        </Stack>
      </ScreenHeight>
    </UserLayout>
  );
};

export default Page;
