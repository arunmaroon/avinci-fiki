import { createTheme } from "@mui/material";

import { muiTypographyTheme } from "./typography-theme";
import { flipkartTokens, pothosTokens, jifyTokens, PothosTokensType } from "@mvloans/base-ui.tokens";

function getAppTokens(name: string) {
  if (name === PWAThemeNames.FLIPKART) {
    return flipkartTokens;
  }
  if (name === PWAThemeNames.JIFY) {
    return jifyTokens;
  }
  return pothosTokens;
}
import { breakpoints } from "./breakpoints";
import { PWAThemeNames } from "./constant";

export const getTheme = (themeName: string) => {
  let tokens = getAppTokens(themeName);
  return createTheme({
    components: {
      // @ts-ignore
      MuiTypography: muiTypographyTheme.MuiTypography,

      // @ts-ignore
      MuiLink: muiTypographyTheme.MuiLink,
    },
    typography: muiTypographyTheme.typography,
    themeName: themeName,
    tokens,
    breakpoints: breakpoints,
  });
};

export type MVTheme = ReturnType<typeof getTheme>;

declare module "@mui/material/styles" {
  export interface Theme {
    tokens: PothosTokensType;
    themeName: PWAThemeNames;
  }
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    mobile360: true;
    mobile480: true;
    tablet768: true;
    tablet960: true;
    desktop1440: true;
  }
}
