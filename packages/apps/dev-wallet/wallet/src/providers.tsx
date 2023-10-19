import { CryptoContextProvider } from "@/hooks/crypto.context";
import { darkThemeClass } from "@kadena/react-ui/theme";
import { ThemeProvider } from "next-themes";
import { ModalProvider } from "@kadena/react-ui";

import { RemoteConnectionContext } from "@/hooks/remote.context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CryptoContextProvider>
      <ThemeProvider
        attribute="class"
        enableSystem={true}
        defaultTheme="dark"
        value={{
          light: "light",
          dark: darkThemeClass,
        }}
      >
        <ModalProvider>
          <RemoteConnectionContext>{children}</RemoteConnectionContext>
        </ModalProvider>
      </ThemeProvider>
    </CryptoContextProvider>
  );
}
