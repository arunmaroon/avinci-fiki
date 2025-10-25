import React from "react";
import { Box } from "@mui/material";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import { ScrimArea } from './scrim-area';

export const BasicScrimArea = () => {
  return (
    <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "200px", height: "150px", position: "relative" }}>
      <ThemeProvider>
        <ScrimArea />
        <div style={{ position: "absolute", display: "flex", justifyContent: "center", alignItems: "center" }}>
          Opacity - 0.5 (default)
        </div>
      </ThemeProvider>
    </Box>
  );
}