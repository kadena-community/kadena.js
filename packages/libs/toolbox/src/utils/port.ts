import { getPort } from 'get-port-please';

export async function getRandomNetworkPorts(host: string = '127.0.0.1') {
  const proxy = await getPort({
    host,
    random: true,
    name: 'proxy',
  });
  const startGap = 10;
  const endGap = 100;
  const service = await getPort({
    port: proxy + startGap,
    host,
    portRange: [proxy + startGap, proxy + endGap],
    name: 'service',
  });
  const onDemand = await getPort({
    port: service + startGap,
    host,
    portRange: [service + startGap, service + endGap],
    name: 'onDemand',
  });

  const stratum = await getPort({
    port: onDemand + startGap,
    host,
    portRange: [onDemand + startGap, onDemand + endGap],
    name: 'stratum',
  });

  const p2p = await getPort({
    port: stratum + startGap,
    host,
    portRange: [stratum + startGap, stratum + endGap],
    name: 'p2p',
  });

  return {
    proxy,
    service,
    onDemand,
    stratum,
    p2p,
  };
}
