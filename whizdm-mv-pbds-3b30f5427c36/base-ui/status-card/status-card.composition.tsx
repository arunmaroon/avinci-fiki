import React from "react";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import { Box } from "@mui/material";
import { StatusCard } from "./status-card";

export const BasicInfoStatusCard = () => {
  return (
    <Box sx={{ width: { xs: 312, md: 480 }, margin: "40px auto" }}>
      <ThemeProvider>
        <StatusCard
          status="info"
          title="Purchase incomplete!"
          description={"Your purchase at <Store name> is still incomplete. Verify your KYC to proceed"}
          handleActionClick={() => {}}
          buttonLabel={"Call to action"}
          showCloseButton={true}
        />
      </ThemeProvider>
    </Box>
  );
};

export const BasicWarningStatusCard = () => {
  return (
    <Box sx={{ width: { xs: 312, md: 480 }, margin: "40px auto" }}>
      <ThemeProvider>
        <StatusCard
          status="warning"
          title="Purchase incomplete!"
          description={"Your purchase at <Store name> is still incomplete. Verify your KYC to proceed"}
          handleActionClick={() => {}}
          buttonLabel={"Call to action"}
          showCloseButton={true}
        />
      </ThemeProvider>
    </Box>
  );
};

export const BasicErrorStatusCard = () => {
  return (
    <Box sx={{ width: { xs: 312, md: 480 }, margin: "40px auto" }}>
      <ThemeProvider>
        <StatusCard
          status="error"
          title="Purchase incomplete!"
          description={"Your purchase at <Store name> is still incomplete. Verify your KYC to proceed"}
          handleActionClick={() => {}}
          buttonLabel={"Call to action"}
          showCloseButton={true}
        />
      </ThemeProvider>
    </Box>
  );
};

export const BasicSuccessStatusCard = () => {
  return (
    <Box sx={{ width: { xs: 312, md: 480 }, margin: "40px auto" }}>
      <ThemeProvider>
        <StatusCard
          status="success"
          title="Purchase incomplete!"
          description={"Your purchase at <Store name> is still incomplete. Verify your KYC to proceed"}
          handleActionClick={() => {}}
          buttonLabel={"Call to action"}
          showCloseButton={true}
        />
      </ThemeProvider>
    </Box>
  );
};

export const BasicNonDismissibleInfoStatusCard = () => {
  return (
    <Box sx={{ width: { xs: 312, md: 480 }, margin: "40px auto" }}>
      <ThemeProvider>
        <StatusCard
          status="info"
          title="Purchase incomplete!"
          description={"Your purchase at <Store name> is still incomplete. Verify your KYC to proceed"}
          handleActionClick={() => {}}
          buttonLabel={"Call to action"}
          showCloseButton={false}
        />
      </ThemeProvider>
    </Box>
  );
};

export const BasicNoActionInfoStatusCard = () => {
  return (
    <Box sx={{ width: { xs: 312, md: 480 }, margin: "40px auto" }}>
      <ThemeProvider>
        <StatusCard
          status="info"
          title="Purchase incomplete!"
          description={"Your purchase at <Store name> is still incomplete. Verify your KYC to proceed"}
          showCloseButton={true}
        />
      </ThemeProvider>
    </Box>
  );
};
