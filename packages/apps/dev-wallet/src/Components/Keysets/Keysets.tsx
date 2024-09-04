import { IKeySet } from '@/modules/account/account.repository';
import { linkClass } from '@/pages/select-profile/select-profile.css';
import { getAccountName } from '@/utils/helpers';
import { Box, Heading, Stack, Text } from '@kadena/kode-ui';
import { Link } from 'react-router-dom';
import { ListItem } from '../ListItem/ListItem';
import { listClass, noStyleLinkClass, panelClass } from './style.css';

export function Keysets({ keysets }: { keysets: IKeySet[] }) {
  return (
    <Box className={panelClass} marginBlockStart="xs">
      <Heading as="h4">{keysets.length} keysets</Heading>
      <Link to="/create-account" className={linkClass}>
        Create Keyset
      </Link>
      {keysets.length ? (
        <Box marginBlockStart="md">
          <Text>Owned ({keysets.length})</Text>
          <ul className={listClass}>
            {keysets.map(({ principal, uuid, alias }) => (
              <li key={principal}>
                <Link to={`/account/${uuid}`} className={noStyleLinkClass}>
                  <ListItem>
                    <Stack flexDirection={'column'} gap={'sm'}>
                      <Text>{alias || getAccountName(principal)}</Text>
                    </Stack>
                  </ListItem>
                </Link>
              </li>
            ))}
          </ul>
        </Box>
      ) : null}
    </Box>
  );
}
