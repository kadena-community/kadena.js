import { useNetwork } from '@/modules/network/network.hook';
import { Box, Heading, Text } from '@kadena/kode-ui';
import { Link } from 'react-router-dom';

export function Networks() {
  const { networks } = useNetwork();
  return (
    <>
      <Box margin="md">
        <Heading variant="h5">Networks Page</Heading>
        <Text>Networks</Text>
        <ul>
          {networks.map((network) => (
            <li key={network.uuid}>
              <div>
                <Text>{network.networkId}</Text>
              </div>
              <ul>
                {network.hosts.map(({ url }, index) => (
                  <li key={`url-${index}`}>{url}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <Link to="/networks/create">Create network</Link>
      </Box>
    </>
  );
}
