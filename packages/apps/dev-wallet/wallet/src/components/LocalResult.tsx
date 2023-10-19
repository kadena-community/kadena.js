import { Layer, local } from "@/utils/helpers";
import { Text } from "@kadena/react-ui";
import { IUnsignedCommand } from "@kadena/client";
import useSWR from "swr";

interface ILocalResultProps {
  transaction: IUnsignedCommand;
  layer?: Layer;
}

const fetcher = ({ transaction, layer }: Required<ILocalResultProps>) =>
  local(layer)(transaction);

export const LocalResult = ({
  transaction,
  layer = "l1",
}: ILocalResultProps) => {
  const { data } = useSWR(
    transaction.hash,
    () =>
      fetcher({
        transaction,
        layer,
      }),
    { suspense: true }
  );

  return (
    <Text font="mono">
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Text>
  );
};
