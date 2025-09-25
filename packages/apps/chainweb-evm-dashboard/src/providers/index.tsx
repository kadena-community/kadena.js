import { MediaContextProvider } from "@kadena/kode-ui";
import { SWRConfig } from "swr";
import { ThemeProvider } from "./theme";
import { useData } from "../hooks/useData";
import { chainOptions } from "../utils";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  useData();

  return (
    <SWRConfig
      value={{
        ...chainOptions,
        onError: (error) => {
          console.error('SWR Error:', error);
        },
      }}
    >
      <MediaContextProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </MediaContextProvider>
    </SWRConfig>
  );
};
