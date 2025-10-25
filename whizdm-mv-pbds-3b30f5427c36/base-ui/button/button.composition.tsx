import React from "react";

import { Box } from "@mui/material";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";

import { buttonVariantConstants } from "./constants";
import { Button } from "./button";
import { IconPosition } from "@mvloans/base-ui.mv-svg-icon";
import { variantConstants } from "@mvloans/base-ui.common";

export const PrimaryButtonWithIconOnLeft = () => (
  <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
    <ThemeProvider>
      <Button
        id="PrimaryWithIcon"
        size={variantConstants.BUTTONSMALL}
        variant={buttonVariantConstants.PRIMARY}
        withIcon={true}
        iconPosition={IconPosition.left}
        disabled={false}>
        I'm a button
      </Button>
    </ThemeProvider>
  </Box>
);

export const PrimaryButtonWithIconOnRight = () => (
  <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
    <ThemeProvider>
      <Button id="PrimaryWithIcon" variant={buttonVariantConstants.PRIMARY} withIcon={true} disabled={false}>
        Button
      </Button>
    </ThemeProvider>
  </Box>
);

export const SupportPrimaryButton = () => (
  <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
    <ThemeProvider>
      <Button id="SupportPrimaryWithIcon" variant={buttonVariantConstants.SUPPORT_PRIMARY} withIcon={true} disabled={false}>
        Button
      </Button>
    </ThemeProvider>
  </Box>
);

export const SupportSecondaryButton = () => (
  <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
    <ThemeProvider>
      <Button id="SupportSecondaryWithIcon" variant={buttonVariantConstants.SUPPORT_SECONDARY} withIcon={true} disabled={false}>
        Button
      </Button>
    </ThemeProvider>
  </Box>
);

export const DangerButton = () => (
  <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
    <ThemeProvider>
      <Button id="DangerButtonWithIcon" variant={buttonVariantConstants.DANGER} withIcon={true} disabled={false}>
        Button
      </Button>
    </ThemeProvider>
  </Box>
);

export const LinkButton = () => (
  <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
    <ThemeProvider>
      <Button id="LinkButtonWithIcon" variant={buttonVariantConstants.LINK} withIcon={true} disabled={false}>
        Button
      </Button>
    </ThemeProvider>
  </Box>
);

export const DisabledButton = () => (
  <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
    <ThemeProvider>
      <Button id="DisabledButtonWithIcon" withIcon={true} disabled={true}>
        Button
      </Button>
    </ThemeProvider>
  </Box>
);

export const LoadingButton = () => (
  <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
    <ThemeProvider>
      <Button id="LoadingButton" isLoading={true}>
        Button
      </Button>
    </ThemeProvider>
  </Box>
);

export const SkeletonButton = () => (
  <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
    <ThemeProvider>
      <Button id="SkeletonButton" isSkeleton={true}>
        Button
      </Button>
    </ThemeProvider>
  </Box>
);
