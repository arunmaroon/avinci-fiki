import React, { ReactNode, useMemo } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";

import { getTheme } from "./theme";
import { PWAThemeNames } from "./constant";
import "./styles.css";

export type ThemeProviderProps = {
  /**
   * a node to be rendered in the special component.
   */
  children?: ReactNode;

  /**
   * themeName define palette and custom theme part.
   */
  themeName?: PWAThemeNames;
};

export function ThemeProvider({ children, themeName = PWAThemeNames.PWA }: ThemeProviderProps) {
  const theme = useMemo(() => getTheme(themeName), [themeName]);

  return (
    // https://github.com/mui/material-ui/issues/24109
    <StyledEngineProvider injectFirst>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </StyledEngineProvider>
  );
}
