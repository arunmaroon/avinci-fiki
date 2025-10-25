import React from "react";

import { Box } from "@mui/material";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import { IconNames } from "@mvloans/base-ui.common";
import { Badge } from "./badge";

export const BadgeWithIcon = () => (
  <Box style={{ width: "100px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100px" }}>
    <ThemeProvider>
      <Badge iconName={IconNames.promoCodeTagIcon} badgeContent={6} />
    </ThemeProvider>
  </Box>
);

export const BadgeWithoutIcon = () => (
  <Box style={{ width: "100px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100px" }}>
    <ThemeProvider>
      <Badge badgeContent={6} />
    </ThemeProvider>
  </Box>
);
