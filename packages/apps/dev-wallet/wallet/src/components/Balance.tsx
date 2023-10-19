import { Fungible } from "@/hooks/accounts.hook";
import { getAccountBalances } from "@/utils/account";
import { Layer } from "@/utils/helpers";
import { IconButton, Stack, Tooltip, Text } from "@kadena/react-ui";
import { createRef } from "react";
import useSWR from "swr";

interface IBalanceProps {
  account: string;
  fungibles: Fungible[];
  layer?: Layer;
  networkId?: string;
}

const fetcher = ({ account, fungibles, layer, networkId }: IBalanceProps) =>
  getAccountBalances({
    account,
    fungibles,
    layer,
    networkId,
  });

export const Balance = ({
  account,
  fungibles,
  layer = "l1",
  networkId = "fast-development",
}: IBalanceProps) => {
  const { data } = useSWR(
    account,
    () =>
      fetcher({
        account,
        fungibles,
        layer,
        networkId,
      }),
    { suspense: true }
  );

  return (
    <>
      {data.map((r, i: number) => {
        if (
          r.status === "fulfilled" &&
          r.value.pactResult.result.status === "failure"
        ) {
          const tooltipRef = createRef<HTMLDivElement>();
          return (
            <Stack key={i} alignItems="center">
              <IconButton
                icon={"AlertCircleOutline"}
                title="Error fetching balance"
                onMouseEnter={(e) => Tooltip.handler(e, tooltipRef)}
                onMouseLeave={(e) => Tooltip.handler(e, tooltipRef)}
              />
              <Tooltip.Root ref={tooltipRef} placement="right">
                <div style={{ maxWidth: "300px" }}>
                  <Text font="mono">{JSON.stringify(r.value, null, 2)}</Text>
                </div>
              </Tooltip.Root>
              {`Error fetching balance for ${r.value.fungible.symbol} (chain ${r.value.chainId})`}
            </Stack>
          );
        }

        if (
          r.status === "fulfilled" &&
          r.value.pactResult.result.status === "success"
        ) {
          return (
            <div key={i}>
              {r.value.pactResult.result.data as string}{" "}
              {r.value.fungible.symbol}
            </div>
          );
        }
      })}
    </>
  );
};
