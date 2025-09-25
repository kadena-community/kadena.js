"use client";

import { tokens } from "@kadena/kode-ui/styles";
import styles from "../../app/page.module.css";
import { useAppState } from "../../store/selectors";
import { Icon, Logo } from "../Logo";

import { useEffect, useState } from "react";

export const Overlay = () => {
  const uxTheme = useAppState((state) => state.ux.theme);
  const uxStateIsLoading = useAppState((state) => state.ux.isLoading);
  const [state, setState] = useState<"initiated" | "completed" | "loading">("initiated");

  const dimensions = {
    width: {
      icon: 140,
      logo: 415,
    },
    height: 140,
  }

  useEffect(() => {
    if (!uxStateIsLoading && state === "loading") {
      setState("completed");
    } else if (state === "initiated" && uxStateIsLoading) {
      setTimeout(() => {
        setState("loading");
      }, 400);
    }
  }, [uxStateIsLoading]);

  return (
    <div
      className={[styles.overlay, state === "completed" ? styles.overlayHidden : ''].join(' ')}
      style={{
        backgroundColor: uxTheme.mode === 'dark'
          ? tokens.kda.foundation.color.brand.secondary.n0
          : tokens.kda.foundation.color.neutral.n1
        }}
    >
      <div className={styles.wrapper} style={{ display: "flex", alignItems: "center", gap: -20 }}>
        <Icon width={dimensions.width.icon} height={dimensions.height} state={state} />
        <Logo width={dimensions.width.logo} height={dimensions.height} />
      </div>
    </div>
  )
}
