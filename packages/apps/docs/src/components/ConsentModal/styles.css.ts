import { sprinkles, vars } from "@kadena/react-ui/theme";
import { style } from "@vanilla-extract/css";

export const consentButton = style([
  sprinkles({
    display: "flex",
    alignItems: "center",
    backgroundColor: 'transparent',
    cursor: 'pointer',
  }),
  {
    border: 0,
  }
]);

export const consentButtonPositive  = style([
  consentButton,
  sprinkles({
    color: '$positiveContrast',
  }),
  {
    ':hover': {
      color: vars.colors.$positiveHighContrast,
    },
  }
]);

export const consentButtonNegative  = style([
  consentButton,
  sprinkles({
    color: '$negativeContrast',
  }),
  {
    ':hover': {
      color: vars.colors.$negativeHighContrast,
    },
  }
]);
