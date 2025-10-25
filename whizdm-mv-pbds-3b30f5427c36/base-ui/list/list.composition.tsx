import React from "react";
import { List } from "./list";
import { Box } from "@mui/material";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import { IconNames } from "@mvloans/base-ui.common";

export const BasicList = () => {
  return (
    <ThemeProvider>
      <Box style={{ width: "480px" }}>
        <List
          options={[
            { primaryText: "Location", secondaryText: "To verify address details", icon: "ic-print", children: <p>This is child node</p> },
            {
              primaryText: "SMS",
              secondaryText: "To check eligibility and loan amount",
              icon: "ic-print",
            },
            { primaryText: "Media and photos", secondaryText: "To update selfie", icon: "ic-print" },
          ]}
          classes={{ icon: "iconClass" }}
        />
      </Box>
    </ThemeProvider>
  );
};
export const BasicListWithForm = () => {
  return (
    <ThemeProvider>
      <Box style={{ width: "480px" }}>
        <List
          options={[
            { primaryText: "Location", secondaryText: "To verify address details", icon: "ic-print" },
            {
              primaryText: "SMS",
              secondaryText: "To check eligibility and loan amount",
              icon: "ic-print",
              children: <img src={require("./img_Nach_Form.png")} height="100%" width="100%" />,
            },
            { primaryText: "Media and photos", secondaryText: "To update selfie", icon: "ic-print" },
          ]}
        />
      </Box>
    </ThemeProvider>
  );
};

export const BasicListWithJSXElement = () => {
  return (
    <ThemeProvider>
      <Box style={{ width: "480px" }}>
        <List
          options={[
            {
              primaryText: "Location",
              secondaryText: "To verify address details",
              icon: "ic-print",
            },
            {
              primaryText: "SMS",
              secondaryText: "To check eligibility and loan amount",
              icon: "ic-print",
            },
            {
              primaryText: "Media and photos",
              secondaryText: "To update selfie",
              icon: (
                <img
                  src="https://dugtmg0pklp2w.cloudfront.net/pwa-icons/ic-stepper-success-v3.svg"
                  height="100%"
                  width="100%"
                  alt="stepper"
                />
              ),
              rightIcon: IconNames.chevronRightIcon
            },
          ]}
        />
      </Box>
    </ThemeProvider>
  );
};
