"use client";

import { KadenaLogo, NavHeader, NavHeaderButton, NavHeaderLink, NavHeaderLinkList } from "@kadena/kode-ui";
import { MonoRefresh, MonoBrightness6, MonoAutoMode } from "@kadena/kode-icons";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useCallback } from "react";
import { storeHandlers, useAppState } from "../../../store/selectors";
import { ProgressBar } from "../../Stats/indicators";

import styles from "./header.module.css";

type NavData = Array<{
  href: string;
  text: string;
  isExternal?: boolean;
}>;

export const navData: NavData = [
  { href: "/overview", text: "Overview" },
  { href: "/transactions", text: "Transactions" },
  { href: "/gas-analytics", text: "Gas Analytics" },
  { href: "/chain-comparison", text: "Chain Comparison" },
];

export const Nav = () => {
  const pathname = usePathname();
  const uxState = useAppState((state) => state.ux);

  const navLinks = navData.map(({ href, text, isExternal }) => (
    <NavHeaderLink asChild key={href}>
      <Link href={href} { ...isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {} }>
        {text}
      </Link>
    </NavHeaderLink>
  ));
  const activeHref = navData.find(({ href }) => href === pathname)?.href ?? navData[0].href;

  const refreshData = useCallback(() => {
    storeHandlers().ux.setRefreshCount();
    console.log('Reloading chain data...');
  }, []);

  const resetChains = useCallback(() => {
    storeHandlers().ux.resetTimeSettings();
    storeHandlers().chains.resetChainsData();
  }, []);

  const toggleTheme = useCallback(() => {
    storeHandlers().ux.setThemeMode(uxState.theme.mode === 'dark' ? 'light' : 'dark');
  }, [uxState.theme.mode]);

  return (
    <NavHeader activeHref={activeHref} logo={<Link href="/"><KadenaLogo height={40} /></Link>}>
      <ProgressBar className={styles.progressBar} />
      <NavHeaderLinkList>
        {navLinks}
      </NavHeaderLinkList>
      {/* { uxState.chains.lastUpdateTime
        ? <NavHeaderButton
            onPress={refreshData}
            endVisual={<MonoRefresh />}
          >
            {`Last update: ${uxState.chains.lastUpdateTime}`}
          </NavHeaderButton>
        : null
      } */}
      <NavHeaderButton
        onPress={toggleTheme}
        endVisual={<MonoBrightness6 />}
      />
      <NavHeaderButton
        onPress={resetChains}
        endVisual={<MonoAutoMode />}
      />
    </NavHeader>
  );
};
