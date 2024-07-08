import { useWallet } from '@/modules/wallet/wallet.hook';
import {
  chainListClass,
  listClass,
  listItemClass,
  panelClass,
} from '@/pages/home/style.css.ts';
import { getAccountName } from '@/utils/helpers';
import { Box, Heading, Stack, Text } from '@kadena/react-ui';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { linkClass } from '../select-profile/select-profile.css';

export function HomePage() {
  const { accounts, profile } = useWallet();
  const [selectedAccountIdx, setSelectedAccountIdx] = useState<number>(-1);

  return (
    <>
      <Box>
        <Text>Welcome back</Text>
        <Heading as="h1">{profile?.name}</Heading>
        <Box className={panelClass} marginBlockStart="xl">
          <Heading as="h4">Your assets</Heading>
          <Box marginBlockStart="md">
            <Text>Tokens</Text>
          </Box>
        </Box>
        <Box className={panelClass} marginBlockStart="xs">
          <Heading as="h4">{accounts.length} accounts</Heading>
          <Link to="/create-account" className={linkClass}>
            Create Account
          </Link>
          <Box marginBlockStart="md">
            <Text>Owned ({accounts.length})</Text>
            {accounts.length ? (
              <ul className={listClass}>
                {accounts.map(({ address, overallBalance, chains }, idx) => (
                  <li key={address}>
                    <Stack
                      justifyContent="space-between"
                      className={listItemClass}
                      onClick={() => {
                        setSelectedAccountIdx((cu) => {
                          return cu === idx ? -1 : idx;
                        });
                      }}
                    >
                      <Text>{getAccountName(address) ?? 'No Address ;(!'}</Text>
                      <Text>{overallBalance} KDA</Text>
                    </Stack>
                    {selectedAccountIdx === idx && chains.length > 0 && (
                      <ul className={chainListClass}>
                        {chains.map(({ chainId, balance }) => (
                          <li key={address}>
                            <Stack
                              justifyContent="space-between"
                              className={listItemClass}
                            >
                              <Text>chain {chainId}</Text>
                              <Text>{balance} KDA</Text>
                            </Stack>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            ) : null}
          </Box>
        </Box>
      </Box>
    </>
  );
}
