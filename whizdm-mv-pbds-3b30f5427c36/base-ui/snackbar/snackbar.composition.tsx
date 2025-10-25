import React from "react";
import { Box } from "@mui/system";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import { Snackbar, iconTypes } from "./snackbar";
import { IconNames } from "@mvloans/base-ui.common";

export const ErrorSnackbarWithTitleDescription = () => {
  return (
    <Box
      sx={{
        width: "360px",
        height: "70px",
      }}>
      <ThemeProvider>
        <Snackbar title="Title" message="Description" showAction={true} iconType={iconTypes.ERROR} />
      </ThemeProvider>
    </Box>
  );
};
export const ErrorSnackbar = () => {
  return (
    <Box
      sx={{
        width: "360px",
        height: "70px",
      }}>
      <ThemeProvider>
        <Snackbar message="This is an error" iconType={iconTypes.ERROR} />
      </ThemeProvider>
    </Box>
  );
};

export const NeutralSnackbar = () => {
  return (
    <Box
      sx={{
        width: "360px",
        height: "70px",
      }}>
      <ThemeProvider>
        <Snackbar message="This is an error" iconType={iconTypes.NEUTRAL} />
      </ThemeProvider>
    </Box>
  );
};

export const SuccessSnackbar = () => {
  return (
    <Box
      sx={{
        width: "360px",
        height: "140px",
      }}>
      <ThemeProvider>
        <Snackbar
          message="This is a very long success message to demonstrate how long snack bar messages would look like on the UI"
          iconType={iconTypes.SUCCESS}
        />
      </ThemeProvider>
    </Box>
  );
};

export const WarningSnackbar = () => {
  return (
    <Box
      sx={{
        width: "360px",
        height: "70px",
      }}>
      <ThemeProvider>
        <Snackbar message="This is a warning" iconType={iconTypes.WARNING} />
      </ThemeProvider>
    </Box>
  );
};

export const InfoSnackbar = () => {
  return (
    <Box
      sx={{
        width: "360px",
        height: "70px",
      }}>
      <ThemeProvider>
        <Snackbar message="This is an info" iconType={iconTypes.INFO} />
      </ThemeProvider>
    </Box>
  );
};

export const HideCloseErrorSnackbar = () => {
  return (
    <Box
      sx={{
        width: "360px",
        height: "70px",
      }}>
      <ThemeProvider>
        <Snackbar showClose={false} message="This is an error" iconType={iconTypes.ERROR} />
      </ThemeProvider>
    </Box>
  );
};

export const HideCloseSuccessSnackbar = () => {
  return (
    <Box
      sx={{
        width: "360px",
        height: "70px",
      }}>
      <ThemeProvider>
        <Snackbar showClose={false} message="This is a success" iconType={iconTypes.SUCCESS} />
      </ThemeProvider>
    </Box>
  );
};

export const HideCloseWarningSnackbar = () => {
  return (
    <Box
      sx={{
        width: "360px",
        height: "70px",
      }}>
      <ThemeProvider>
        <Snackbar showClose={false} message="This is a warning" iconType={iconTypes.WARNING} />
      </ThemeProvider>
    </Box>
  );
};

export const HideCloseInfoSnackbar = () => {
  return (
    <Box
      sx={{
        width: "360px",
        height: "70px",
      }}>
      <ThemeProvider>
        <Snackbar showClose={false} message="This is an info" iconType={iconTypes.INFO} />
      </ThemeProvider>
    </Box>
  );
};
