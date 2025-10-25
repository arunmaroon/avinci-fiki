import React from "react";
import { PwaFooter } from './pwa-footer';
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import Box from "@mui/material/Box";

export const BasicPwaFooter = () => {
  return (
    <ThemeProvider>
      <Box sx={{ width: "1000px" }}>
        <PwaFooter />
      </Box>
    </ThemeProvider>
  );
}
