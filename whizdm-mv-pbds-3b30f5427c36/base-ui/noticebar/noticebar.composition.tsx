import React from "react";
import { Box } from "@mui/system";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import { IconNames } from "@mvloans/base-ui.common";
import { Noticebar } from "./noticebar";
import { iconTypes } from "./constants";

export const ErrorNoticebarWithTitleDescription = () => {
  return (
    <Box
      sx={{
        width: "360px",
        height: "70px",
      }}>
      <ThemeProvider>
        <Noticebar leadingIcon={IconNames.infoIcon} title="Title" message="Description" iconType={iconTypes.ERROR} />
      </ThemeProvider>
    </Box>
  );
};
export const ErrorNoticebar = () => {
  return (
    <Box
      sx={{
        width: "360px",
        height: "70px",
      }}>
      <ThemeProvider>
        <Noticebar message="Message" iconType={iconTypes.ERROR} />
      </ThemeProvider>
    </Box>
  );
};

export const SuccessNoticebar = () => {
  return (
    <Box
      sx={{
        width: "360px",
        height: "140px",
      }}>
      <ThemeProvider>
        <Noticebar
          message="This is a very long success message to demonstrate how long snack bar messages would look like on the UI"
          iconType={iconTypes.SUCCESS}
        />
      </ThemeProvider>
    </Box>
  );
};

export const DefaultNoticebar = () => {
  return (
    <Box
      sx={{
        width: "360px",
        height: "140px",
      }}>
      <ThemeProvider>
        <Noticebar message="This is a success snackbar" />
      </ThemeProvider>
    </Box>
  );
};

export const WarningNoticebar = () => {
  return (
    <Box
      sx={{
        width: "360px",
        height: "70px",
      }}>
      <ThemeProvider>
        <Noticebar message="This is a warning" iconType={iconTypes.WARNING} />
      </ThemeProvider>
    </Box>
  );
};

export const InfoNoticebar = () => {
  return (
    <Box
      sx={{
        width: "360px",
        height: "70px",
      }}>
      <ThemeProvider>
        <Noticebar message="This is an info" iconType={iconTypes.INFO} />
      </ThemeProvider>
    </Box>
  );
};

export const HideCloseErrorNoticebar = () => {
  return (
    <Box
      sx={{
        width: "360px",
        height: "70px",
      }}>
      <ThemeProvider>
        <Noticebar message="This is an error" iconType={iconTypes.ERROR} />
      </ThemeProvider>
    </Box>
  );
};

export const HideCloseSuccessNoticebar = () => {
  return (
    <Box
      sx={{
        width: "360px",
        height: "70px",
      }}>
      <ThemeProvider>
        <Noticebar message="This is a success" iconType={iconTypes.SUCCESS} />
      </ThemeProvider>
    </Box>
  );
};

export const HideCloseWarningNoticebar = () => {
  return (
    <Box
      sx={{
        width: "360px",
        height: "70px",
      }}>
      <ThemeProvider>
        <Noticebar message="This is a warning" iconType={iconTypes.WARNING} />
      </ThemeProvider>
    </Box>
  );
};

export const HideCloseInfoNoticebar = () => {
  return (
    <Box
      sx={{
        width: "360px",
        height: "70px",
      }}>
      <ThemeProvider>
        <Noticebar message="This is an info" iconType={iconTypes.INFO} />
      </ThemeProvider>
    </Box>
  );
};
