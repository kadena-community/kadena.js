import { storeHandlers, useAppState } from "../store/selectors";
import { useChainsData } from "./useChainsData";
import { initialState } from "../store/chain/reducers";
import { useEffect } from "react";

export const useData = () => {
  const stateChains = useAppState((state) => state.chains);
  const refreshCount = useAppState((state) => state.ux.refreshCount);
  const chainsConfig = stateChains.length > 0 ? stateChains : initialState.chains;
  const storeUXHandlers = storeHandlers().ux;

  const {
    isLoading,
  } = useChainsData(chainsConfig);

  useEffect(() => {
    storeUXHandlers.setLoading(isLoading);
  }, [isLoading]);
};
