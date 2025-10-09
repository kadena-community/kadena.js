"use client";

import { Box, Card, Grid, GridItem, Heading, Stack, Text } from "@kadena/kode-ui";
import { storeHandlers, useAppState } from "../../store/selectors";

import styles from '../page.module.css';

import { Box as StatsBox, LabeledBox } from '../../components/Stats/box';
import { tokens } from "@kadena/kode-ui/styles";
import { __n } from "../../utils";
import {
  AddressesGraph,
  BlocksGraph,
  ChainsGraph,
  ChainStatus,
  DataIndicator,
  TransactionsGraph
} from "../../components/Stats/indicators";
import { Chain } from "../../store/chain/type";
import { _n, toFixed } from "../../utils/number";
import { convertColorToBackgroundSubtleColor, createGradient } from "../../utils/color";

export default function Page() {
  const chainState = useAppState((state) => state.chains);
  const chainUXState = useAppState((state) => state.ux.chains);
  useAppState((state) => state.ux.theme);

  const chainHandlers = storeHandlers().chains;
  const uxHandlers = storeHandlers().ux;

  const allTransactionCount = chainHandlers.getAllTransactionsCount();
  const allBlocksCount = chainHandlers.getAllBlocksCount();
  const allAddressesCount = chainHandlers.getAllAddressesCount();
  const allActiveChainsCount = chainHandlers.getAllActiveChainsCount();
  const totalChainsCount = chainHandlers.getAllChainsCount();

  const chainTransactionPercent = (chain: Chain) => chainHandlers.getChainTransactionsPercentage(chain.id);
  const chainAddressesPercent = (chain: Chain) => chainHandlers.getChainAddressesPercentage(chain.id);
  const chainBlocksPercent = (chain: Chain) => chainHandlers.getChainBlocksPercentage(chain.id);
  const chainAverageBlockTimePercent = (chain: Chain) => chainHandlers.getChainAverageBlockTimePercentage(chain.id);

  const graphTitle = chainHandlers.getGraphTitle('newTxns');

  return (
    <main>
      <section>
        <Box padding="lg">
          <Grid
            columns={{
              xs: 1,
              sm: 2,
              lg: 2,
              xl: 4,
            }}
            gap="xl"
            flexGrow={1}
          >
            <GridItem>
              <Card fullWidth>
                <div className={styles.overallCardBackground} style={{ background: createGradient({
                  from: 'transparent',
                  to: tokens.kda.foundation.color.background.surface.default,
                  direction: 'to top',
                }) }} />
                <div className={styles.overallCard} style={{ paddingInline: tokens.kda.foundation.spacing.n5 }}>
                  <Stack
                    alignItems="flex-start"
                    flexDirection="column"
                    gap="xxs"
                  >
                    <span style={{ color: tokens.kda.foundation.color.text.gray.default }}>
                      <Text bold size="smallest" color="inherit">Overall Created</Text>
                    </span>
                    <Heading className={styles.heading} variant="h6">Transactions</Heading>
                    <StatsBox>
                      { __n(allTransactionCount) }
                    </StatsBox>
                  </Stack>
                  <TransactionsGraph chartId="transaction-graph-tooltip" title={graphTitle} className={styles.overallChainsBoxGraph} />
                </div>
              </Card>
            </GridItem>
            <GridItem>
              <Card fullWidth>
                <div className={styles.overallCardBackground} style={{ background: createGradient({
                  from: 'transparent',
                  to: tokens.kda.foundation.color.background.surface.default,
                  direction: 'to top',
                }) }} />
                <div className={styles.overallCard} style={{ paddingInline: tokens.kda.foundation.spacing.n5 }}>
                  <Stack
                    alignItems="flex-start"
                    flexDirection="column"
                    gap="xxs"
                  >
                    <span style={{ color: tokens.kda.foundation.color.text.gray.default }}>
                      <Text bold size="smallest" color="inherit">Overall New</Text>
                    </span>
                    <Heading className={styles.heading} variant="h6">Blocks</Heading>
                    <StatsBox>
                      { __n(allBlocksCount) }
                    </StatsBox>
                  </Stack>
                  <BlocksGraph options={{ ticks: 20 }} className={styles.overallChainsBoxGraph} />
                </div>
              </Card>
            </GridItem>
            <GridItem>
              <Card fullWidth>
                <div className={styles.overallCardBackground} style={{ background: createGradient({
                  from: 'transparent',
                  to: tokens.kda.foundation.color.background.surface.default,
                  direction: 'to top',
                }) }} />
                <div className={styles.overallCard} style={{ paddingInline: tokens.kda.foundation.spacing.n5 }}>
                  <Stack
                    alignItems="flex-start"
                    flexDirection="column"
                    gap="xxs"
                  >
                    <span style={{ color: tokens.kda.foundation.color.text.gray.default }}>
                      <Text bold size="smallest" color="inherit">Overall Accumulated</Text>
                    </span>
                    <Heading className={styles.heading} variant="h6">Addresses</Heading>
                    <StatsBox>
                      { __n(allAddressesCount) }
                    </StatsBox>
                  </Stack>
                  <AddressesGraph options={{ ticks: 20 }} className={styles.overallChainsBoxGraph} />
                </div>
              </Card>
            </GridItem>
            <GridItem>
              <Card fullWidth>
                <div className={styles.overallCardBackground} style={{ background: createGradient({
                  from: 'transparent',
                  to: tokens.kda.foundation.color.background.surface.default,
                  direction: 'to top',
                }) }} />
                <div className={styles.overallCard} style={{ paddingInline: tokens.kda.foundation.spacing.n5 }}>
                  <Stack
                    alignItems="flex-start"
                    flexDirection="column"
                    gap="xxs"
                  >
                    <span style={{ color: tokens.kda.foundation.color.text.gray.default }}>
                      <Text bold size="smallest" color="inherit">Active</Text>
                    </span>
                    <Heading className={styles.heading} variant="h6">Chains</Heading>
                    <StatsBox>
                      { allActiveChainsCount }/{ totalChainsCount }
                    </StatsBox>
                  </Stack>
                  <ChainsGraph className={styles.guageChainsBoxGraph} chainCount={totalChainsCount} activeChainCount={allActiveChainsCount} />
                </div>
              </Card>
            </GridItem>
          </Grid>
        </Box>
        <Box padding="lg" style={{ paddingTop: tokens.kda.foundation.spacing.n0 }}>
          <Grid
            columns={{
              xs: 1,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 5,
            }}
            gap="xl"
          >
          { chainState.map((chain) => (
              <GridItem key={chain.id}>
                <Card fullWidth className={[
                  styles.overallCardStats,
                  chainUXState?.[chain.id]?.isLoading || chain.metaData.status !== 'online'
                    ? styles.overallCardStatsLoading
                    : null
                  ].filter(Boolean).join(' ')}
                >
                  <div className={styles.chainBoxGraphContainer}>
                    <TransactionsGraph
                      chartId={`chain-${chain.id}-transactions-graph`}
                      title={graphTitle}
                      chainId={chain.id}
                      className={styles.chainBoxGraph}
                      options={{
                        strokeColor: chain.metaData.color,
                        strokeWidth: 2,
                        fillColor: "none",
                        margins: {
                          top: 20,
                          right: 20,
                          bottom: 20,
                          left: 0
                        },
                        background: {
                          isGradient: true,
                          from: convertColorToBackgroundSubtleColor(chain.metaData.color, undefined, uxHandlers.isDarkMode()),
                          to: 'transparent',
                          direction: 'to bottom'
                        }
                      }}
                    />
                  </div>
                  <Stack
                    alignItems="flex-start"
                    flexDirection="column"
                    gap="xxs"
                    width="100%"
                  >
                    <span style={{ color: tokens.kda.foundation.color.text.gray.default, marginBottom: tokens.kda.foundation.spacing.md }}>
                      <Text bold size="small">Chain { chain.id } <ChainStatus chain={chain} /></Text>
                    </span>
                    <div className={styles.labeledBoxContainer} style={{ gap: tokens.kda.foundation.spacing.md, width: '100%' }}>
                      <Grid
                        columns={2}
                        gap="md"
                        width="100%"
                      >
                        <GridItem>
                          <LabeledBox label="Transactions">
                            <DataIndicator value={chainTransactionPercent(chain)} max={100} color={chain.metaData.color} />
                            { __n(chain.stats?.transactions?.totalTxns.value ?? 0) }{chain.stats?.transactions?.totalTxns.units}
                          </LabeledBox>
                        </GridItem>
                        <GridItem>
                          <LabeledBox label="Addresses">
                            <DataIndicator value={chainAddressesPercent(chain)} max={100} color={chain.metaData.color} />
                            { __n(chain.stats?.addresses?.totalAddresses.value ?? 0) }
                          </LabeledBox>
                        </GridItem>
                        <GridItem>
                          <LabeledBox label="Blocks">
                            <DataIndicator value={chainBlocksPercent(chain)} max={100} color={chain.metaData.color} />
                            { __n(chain.stats?.blocks?.totalBlocks.value ?? 0) }
                          </LabeledBox>
                        </GridItem>
                        <GridItem>
                          <LabeledBox label="Average Block Time">
                            <DataIndicator value={chainAverageBlockTimePercent(chain)} max={100} color={chain.metaData.color} />
                            { toFixed(chain.stats?.blocks?.averageBlockTime?.value || 0, 1) }{ chain.stats?.blocks?.averageBlockTime?.units || '' }
                        </LabeledBox>
                        </GridItem>
                        {/* <GridItem>
                          <LabeledBox label="Network Utilization">
                            <DataIndicator value={chainNetworkUtilizationPercentage(chain)} max={100} color={chain.metaData.color} />
                            { _n(chainNetworkUtilizationPercentage(chain)) }%
                          </LabeledBox>
                        </GridItem> */}
                        {/* <GridItem>
                          <LabeledBox label="Indexing Status">
                            <DataIndicator value={chainNetworkUtilizationPercentage(chain)} max={100} color={chain.metaData.color} />
                            { _n(chainNetworkUtilizationPercentage(chain)) }%
                          </LabeledBox>
                        </GridItem> */}
                      </Grid>
                    </div>
                  </Stack>
                </Card>
              </GridItem>
            ))}
          </Grid>
        </Box>
      </section>
    </main>
  )
}
