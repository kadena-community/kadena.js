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
  firstPlaceClass,
  itemsContainerClass,
  listCounterClass,
  listItemClass,
  overflowClass,
  secondPlaceClass,
  winnerClass,
  winnerListClass,
} from '@/styles/leaderboard.css';
import { MonoArrowBack } from '@kadena/react-icons';
import { Stack } from '@kadena/react-ui';
import cn from 'classnames';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { FC } from 'react';

const spring = {
  type: 'spring',
  damping: 9,
  stiffness: 120,
};

const Page: FC = () => {
  const { data } = useLeaderboard();
  const winnerList = data.slice(0, 3);
  const rest = data.slice(3);

  return (
    <UserLayout>
      <ScreenHeight>
        <Stack flexDirection="column" flex={1} className={listCounterClass}>
          <Stack marginBlockEnd="lg">
            <TitleHeader
              Prepend={() => (
                <Link href="/user">
                  <MonoArrowBack />
                </Link>
              )}
              label="Leaderboard"
            />
          </Stack>
          <Heading as="h6">The Platinum Connector</Heading>
          {winnerList && (
            <Stack
              marginBlockStart="sm"
              marginBlockEnd="lg"
              alignItems="center"
              className={winnerListClass}
            >
              <List>
                {winnerList.map((winner, index) => (
                  <motion.li
                    layout
                    key={winner.accountName}
                    layoutId={winner.accountName}
                    transition={spring}
                    className={cn(
                      listItemClass,
                      winnerClass,
                      index === 0 && firstPlaceClass,
                      index === 1 && secondPlaceClass,
                    )}
                    exit={spring}
                    initial={spring}
                  >
                    <Stack
                      display="inline-flex"
                      alignItems="center"
                      justifyContent="space-between"
                      className={itemsContainerClass}
                    >
                      <div className={overflowClass}>
                        {winner.alias}
                        <div className={accountNameClass}>
                          {winner.accountName}
                        </div>
                      </div>
                      <div className={amountClass}>{winner.tokenCount}</div>
                    </Stack>
                  </motion.li>
                ))}
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
                    layoutId={account.accountName}
                    layout
                    transition={spring}
                    className={listItemClass}
                    exit={spring}
                    initial={spring}
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
