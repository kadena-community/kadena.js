import {darkTheme, styled} from '@kadena/react-components';

import {GridRow, Container} from "@/components/Global";
import Link from "next/link";
import {NavBackground} from "@/resources/svg/generated";

export const StyledHeader = styled('header', {
  backgroundColor: "$neutral5",
  color: "$neutral2",

  [`.${darkTheme} &`]: {
    background: '$neutral2',
    color: "$neutral5",
  },
});

export const StyledContainer = styled(Container, {
  position: "relative",
  px: "$4",
  py: "$2",
  height: '$16',
});

export const StyledGridRow = styled(GridRow, {
  position: "relative",
  alignItems: 'center',
  zIndex: 1,
});

export const StyledLeftPanelWrapper = styled('div', {
  display: "flex",
  alignItems: "center",
});

export const StyledLogoWrapper = styled('div', {
  mr: "$2",
});

export const StyledTitle = styled(Link, {
  color: "inherit",
  fontSize: "$base",
  "&:hover": {
    color: "inherit",
  }
});

export const StyledMenuItem = styled(Link, {
  fontSize: "$base",
  fontWeight: "$medium",
  color: "$neutral3",
  transition: "color 0.2s",
  "&:not(:last-child)": {
    mr: "$6",
  },
  [`.${darkTheme} &`]: {
      color: "$neutral4"
  },
  "&:hover": {
    color: "$white",
  }
});

export const StyledBackgroundGlow = styled(NavBackground, {
  position: "absolute",
  top: "0",
  left: "-$4",
  zIndex: 0,
});
