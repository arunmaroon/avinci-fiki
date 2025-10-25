import React from 'react';
import { Box } from '@mui/material';
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import { LineDivider } from './line-divider';

export const HorizontalLineDivider = () => {
  return (
    <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100px" }}>
      <ThemeProvider>
        <LineDivider />
      </ThemeProvider>
    </Box>
  );
}

export const VerticalLineDivider = () => {
  return (
    <Box style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100px" }}>
      <ThemeProvider>
        <LineDivider orientation='vertical' />
      </ThemeProvider>
    </Box>
  );
}

export const HorizontalLineDividerWithChildren = () => {
  return (
    <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "140px" }}>
      <ThemeProvider>
        <LineDivider textAlign='center'>
          Hello
        </LineDivider>
      </ThemeProvider>
    </Box>
  );
}

export const VerticalLineDividerWithChildren = () => {
  return (
    <Box style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100px" }}>
      <ThemeProvider>
        <LineDivider orientation='vertical'>
          Hello
        </LineDivider>
      </ThemeProvider>
    </Box>
  );
}