import React from "react";
import { ThemeProvider } from "./theme-provider";
import Button from "@mui/material/Button";
import { PWAThemeNames } from "./constant";

export const BasicThemeProvider = () => {
  return (
    <ThemeProvider themeName={PWAThemeNames.PWA}>
      <Button variant="contained">Hello World</Button>
    </ThemeProvider>
  );
};
