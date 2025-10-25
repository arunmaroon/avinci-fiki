import React, { useState } from "react";

import { Box, Grid } from "@mui/material";

import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import { buttonVariantConstants } from "@mvloans/base-ui.button";
import TextField from "@mvloans/base-ui.text-field";
import { RadioButton } from "@mvloans/base-ui.radio-button";
import Typography from "@mvloans/base-ui.typography";
import { IconNames, TypographyVariants } from "@mvloans/base-ui.common";
import Button from "@mvloans/base-ui.button";
import { PennyItem, pennyItemVariant } from "@mvloans/base-ui.penny-item";

import { Dialog } from "./dialog";
import { dialogButtonConstants, dialogButtonFlipConstants } from "./constants";
import { useStyles } from "./styles";

const ThemeProviderWrapper = ({ Component }: { Component: React.ElementType }) => {
  return (
    <ThemeProvider>
      <Component />
    </ThemeProvider>
  );
};
const PrimaryDialog = () => {
  const [open, setOpen] = React.useState(false);
  const { theme } = useStyles();
  const { spacing } = theme.tokens;
  const primaryButtonConfig = [
    {
      variant: buttonVariantConstants.PRIMARY,
      btnText: "Verify OTP",
      onClick: () => setOpen(false),
    },
  ];
  return (
    <>
      <Button onClick={() => setOpen(true)}>{"Click To Open"}</Button>
      <Dialog
        open={open}
        closeIcon={true}
        onClose={() => setOpen(false)}
        title="Verify employment"
        subTitle="OTP has been sent to your work email ID"
        buttonConfig={primaryButtonConfig}>
        <Box sx={{ marginTop: spacing.default }}>
          <TextField label="OTP" />
        </Box>
      </Dialog>
    </>
  );
};

const Modal = () => {
  const [open, setOpen] = React.useState(false);
  const { theme } = useStyles();
  const { spacing } = theme.tokens;
  const primaryButtonConfig = [
    {
      variant: buttonVariantConstants.PRIMARY,
      btnText: "Verify OTP",
      onClick: () => setOpen(false),
    },
  ];
  return (
    <>
      <Button onClick={() => setOpen(true)}>{"Click To Open"}</Button>
      <Dialog
        open={open}
        closeIcon
        onClose={() => setOpen(false)}
        title="Verify employment"
        subTitle="OTP has been sent to your work email ID"
        buttonConfig={primaryButtonConfig}>
        <Box sx={{ marginTop: spacing.spacious }}>
          <TextField label="OTP" />
        </Box>{" "}
      </Dialog>
    </>
  );
};

const SecondaryDialog = () => {
  const [open, setOpen] = React.useState(false);
  const secondaryButtonConfig = [
    {
      variant: buttonVariantConstants.PRIMARY,
      btnText: "Upload Bank Statement",
      onClick: () => setOpen(false),
    },
    {
      variant: buttonVariantConstants.SUPPORT_SECONDARY,
      btnText: "Try Again",
      onClick: () => console.log("Try Again"),
    },
  ];
  return (
    <>
      <Button onClick={() => setOpen(true)}>{"Click To Open"}</Button>
      <Dialog
        open={open}
        title="Netbanking verification failed"
        description="Your netbanking verification has failed. Please try uploading bank statements"
        buttonConfig={secondaryButtonConfig}></Dialog>
    </>
  );
};

const TertiaryDialog = () => {
  const { theme } = useStyles();
  const { spacing } = theme.tokens;
  const [open, setOpen] = React.useState(false);
  const tertiaryButtonConfig = [
    {
      variant: buttonVariantConstants.SUPPORT_SECONDARY,
      btnText: "Continue",
      onClick: () => console.log("Continue Clicked"),
    },
    {
      variant: buttonVariantConstants.PRIMARY,
      btnText: "Submit",
      onClick: () => setOpen(false),
    },
  ];
  return (
    <>
      <Button onClick={() => setOpen(true)}>{"Click To Open"}</Button>
      <Dialog
        open={open}
        title="Did something go wrong?"
        subTitle="Select a reason for not completing your KYC"
        buttonConfig={tertiaryButtonConfig}
        desktopView={dialogButtonConstants.SINGLE_LINE}
        mobileView={dialogButtonConstants.SINGLE_LINE}>
        <Box sx={{ marginTop: spacing.default }}>
          <RadioButton
            options={[
              { value: "My mobile number is not linked with Aadhaar", label: "My mobile number is not linked with Aadhaar" },
              { value: "I did not receive the OTP", label: "I did not receive the OTP" },
              { value: "I feel it’s not safe and secure", label: "I feel it’s not safe and secure" },
              { value: "My reason is not listed here", label: "My reason is not listed here" },
            ]}
          />
        </Box>
      </Dialog>
    </>
  );
};

const InformationDialog = () => {
  const { theme } = useStyles();
  const { spacing } = theme.tokens;
  const [open, setOpen] = React.useState(false);
  const infoButtonConfig = [
    {
      variant: buttonVariantConstants.PRIMARY,
      btnText: "Let’s go",
      onClick: () => setOpen(false),
    },
  ];
  return (
    <>
      <Button onClick={() => setOpen(true)}>{"Click To Open"}</Button>
      <Dialog
        open={open}
        closeIcon={true}
        onClose={() => setOpen(false)}
        icon={{ iconName: "ic-rocket" }}
        title="Great! You are just 4 steps away from getting the loan"
        buttonConfig={infoButtonConfig}>
        <Box marginTop={spacing.default}>
          <Grid paddingY={spacing.compact} container gap={spacing.default} direction={"row"}>
            <PennyItem variant={pennyItemVariant.NUMBER} label={1} />
            <Typography variant={TypographyVariants.bodyMediumLowEmphasis}>{"Basic information"}</Typography>
          </Grid>
          <Grid paddingY={spacing.compact} container gap={spacing.default} direction={"row"}>
            <PennyItem variant={pennyItemVariant.NUMBER} label={2} />
            <Typography variant={TypographyVariants.bodyMediumLowEmphasis}>{"Verify KYC"}</Typography>
          </Grid>
          <Grid paddingY={spacing.compact} container gap={spacing.default} direction={"row"}>
            <PennyItem variant={pennyItemVariant.NUMBER} label={3} />
            <Typography variant={TypographyVariants.bodyMediumLowEmphasis}>{"Set up  EMI auto debit"}</Typography>
          </Grid>
          <Grid paddingY={spacing.compact} container gap={spacing.default} direction={"row"}>
            <PennyItem variant={pennyItemVariant.NUMBER} label={4} />
            <Typography variant={TypographyVariants.bodyMediumLowEmphasis}>{"Review and sign agreement"}</Typography>
          </Grid>
        </Box>
      </Dialog>
    </>
  );
};
const PanCardDialog = () => {
  const { theme } = useStyles();
  const { spacing, semColors } = theme.tokens;

  const [open, setOpen] = React.useState(false);
  const panCardButtonConfig = [
    {
      variant: buttonVariantConstants.PRIMARY,
      btnText: "Yes, that’s correct",
      onClick: () => setOpen(false),
    },
    {
      variant: buttonVariantConstants.SUPPORT_PRIMARY,
      btnText: "No, I’ll enter manually",
      onClick: () => console.log("Try Again"),
    },
  ];
  return (
    <>
      <Button onClick={() => setOpen(true)}>{"Click To Open"}</Button>
      <Dialog
        closeIcon={true}
        onClose={() => setOpen(false)}
        open={open}
        icon={{ iconName: "ic-pan-card", textAlign: "center" }}
        buttonConfig={panCardButtonConfig}>
        <Grid style={{ textAlign: "center" }}>
          <Typography variant={TypographyVariants.bodyMediumLowEmphasis} colorValue={semColors.neutral.text.mediumEmphasis}>
            {"Confirm your PAN card number"}
          </Typography>
          <div style={{ height: spacing.default }}></div>
          <Typography variant={TypographyVariants.title1} colorValue={semColors.neutral.text.highEmphasis}>
            {"ABCDE1234F"}
          </Typography>
        </Grid>
      </Dialog>
    </>
  );
};

const Alert = () => {
  const [open, setOpen] = React.useState(false);
  const alertButtonConfig = [
    {
      variant: buttonVariantConstants.LINK,
      btnText: "Continue",
      onClick: () => console.log("Continue Clicked"),
    },
    {
      variant: buttonVariantConstants.PRIMARY,
      btnText: "Cancel",
      onClick: () => setOpen(false),
    },
  ];
  return (
    <ThemeProvider>
      <Button onClick={() => setOpen(true)}>{"Click To Open"}</Button>
      <Dialog
        open={open}
        isAlert
        title="Are you sure you want to go back?"
        description="Don’t worry, you KYC details are saved and won’t be affected"
        buttonConfig={alertButtonConfig}></Dialog>
    </ThemeProvider>
  );
};

const SecondaryAlert = () => {
  const [open, setOpen] = React.useState(false);
  const alertButtonConfig = [
    {
      variant: buttonVariantConstants.LINK,
      btnText: "Continue",
      onClick: () => console.log("Continue Clicked"),
    },
    {
      variant: buttonVariantConstants.PRIMARY,
      btnText: "Cancel",
      onClick: () => setOpen(false),
    },
  ];
  return (
    <>
      <Button onClick={() => setOpen(true)}>{"Click To Open"}</Button>
      <Dialog
        open={open}
        closeIcon={true}
        onClose={() => setOpen(false)}
        isAlert
        title="Are you sure you want to skip income verification?"
        description="You will be eligible for a maximum loan amount of upto ₹10,000"
        buttonConfig={alertButtonConfig}
        desktopView={dialogButtonConstants.SINGLE_LINE}
        mobileView={dialogButtonConstants.MULTI_LINE}
        flipButtons={dialogButtonFlipConstants.MOBILE_FLIP}></Dialog>
    </>
  );
};
const FullScreenDialog = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{"Click To Open"}</Button>
      <Dialog open={open} showFullScreen={true} icon={{ iconName: "ic-pool-loader", textAlign: "center" }}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant={TypographyVariants.bodySmallHighEmphasis}>{"Please wait..."}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant={TypographyVariants.bodySmallLowEmphasis}>
              {"Verifying your application/details. Please wait as we verify your details, this may take less than a minute"}
            </Typography>
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
};

const FullScreenDialogSVG = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{"Click To Open SVG"}</Button>
      <Dialog open={open} showFullScreen={true} icon={{ iconName: IconNames.accordionPdfDocIcon, textAlign: "center" }}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant={TypographyVariants.bodySmallHighEmphasis}>{"Please wait..."}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant={TypographyVariants.bodySmallLowEmphasis}>
              {"Verifying your application/details. Please wait as we verify your details, this may take less than a minute"}
            </Typography>
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
};

const NoTitleSubtitleIconDialog = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{"Click To Open SVG"}</Button>
      <Dialog open={open} closeIcon={true} showFullScreen={true}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant={TypographyVariants.bodySmallHighEmphasis}>{"Please wait..."}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant={TypographyVariants.bodySmallLowEmphasis}>
              {"Verifying your application/details. Please wait as we verify your details, this may take less than a minute"}
            </Typography>
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
};

export const PrimaryDialogWrapper = () => <ThemeProviderWrapper Component={PrimaryDialog} />;
export const ModalWrapper = () => <ThemeProviderWrapper Component={Modal} />;
export const SecondaryDialogWrapper = () => <ThemeProviderWrapper Component={SecondaryDialog} />;
export const TertiaryDialogWrapper = () => <ThemeProviderWrapper Component={TertiaryDialog} />;
export const InformationDialogWrapper = () => <ThemeProviderWrapper Component={InformationDialog} />;
export const PanCardDialogWrapper = () => <ThemeProviderWrapper Component={PanCardDialog} />;
export const AlertWrapper = () => <ThemeProviderWrapper Component={Alert} />;
export const SecondaryAlertWrapper = () => <ThemeProviderWrapper Component={SecondaryAlert} />;
export const FullScreenDialogWrapper = () => <ThemeProviderWrapper Component={FullScreenDialog} />;
export const FullScreenDialogSVGWrapper = () => <ThemeProviderWrapper Component={FullScreenDialogSVG} />;
export const NoTitleSubtitleIconDialogWrapper = () => <ThemeProviderWrapper Component={NoTitleSubtitleIconDialog} />;
