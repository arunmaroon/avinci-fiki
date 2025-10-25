import React, { useState } from "react";
import { Fileupload } from "./fileupload";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import { Box } from "@mui/material";
import { actionTypes, fileStatus, leftIconType } from "./constants";
import { IconNames } from "@mvloans/base-ui.common";

export const BasicFileupload = () => {
  const [status, setStatus] = useState(fileStatus.default);

  const onAction = ({ type }: any) => {
    if (type === actionTypes.leftIcon) setStatus(fileStatus.error);
  };
  return (
    <ThemeProvider>
      <Box sx={{ width: 480 }}>
        <Fileupload
          label={"Upload document"}
          id={"upload"}
          status={status}
          onAction={onAction}
          description={"Error Test"}
          rightIcon={{ actionType: "loading", icon: IconNames.loaderIcon }}></Fileupload>
      </Box>
    </ThemeProvider>
  );
};

export const BasicFileuploadError = () => {
  const [status, setStatus] = useState(fileStatus.success);

  const onAction = ({ type, config }: { type: any; config?: string }) => {
    if (type === actionTypes.rightIcon && config === "loading") setStatus(fileStatus.error);
  };

  return (
    <ThemeProvider>
      <Box sx={{ width: 480 }}>
        <Fileupload
          label={"Upload document"}
          id={"upload2"}
          status={status}
          onAction={onAction}
          description={"Uploaded to error"}
          leftIcon={{ type: leftIconType.icon, url: "ic-pdf" }}
          value="1"
          rightIcon={{ actionType: "loading", icon: IconNames.fileUploadIcon }}></Fileupload>
      </Box>
    </ThemeProvider>
  );
};

export const BasicFileuploaded = () => {
  const [status, setStatus] = useState(fileStatus.default);

  const onFileChange = (type: any) => {
    if (type === actionTypes.rightIcon) setStatus(fileStatus.success);
  };
  return (
    <ThemeProvider>
      <Box sx={{ width: 480 }}>
        <Fileupload
          label={"Upload document"}
          id={"uploaded"}
          status={status}
          onAction={onFileChange}
          description={"Success"}
          rightIcon={{ actionType: "loading", icon: IconNames.closeIcon }}></Fileupload>
      </Box>
    </ThemeProvider>
  );
};

export const BasicFileuploadedWithHelperText = () => {
  const [status, setStatus] = useState(fileStatus.default);

  const onFileChange = (type: any) => {
    console.log("Test");
    if (type === actionTypes.rightIcon) setStatus(fileStatus.success);
  };

  return (
    <ThemeProvider>
      <Box sx={{ width: 480 }}>
        <Fileupload
          label={"Upload document"}
          id={"uploaded"}
          status={status}
          onAction={onFileChange}
          description={"Success"}
          rightIcon={{ actionType: "loading", icon: IconNames.closeIcon }}
          helperText="Hello"
          value={1}
        />
      </Box>
    </ThemeProvider>
  );
};

export const BasicFileuploadedDisabled = () => {
  const [status, setStatus] = useState(fileStatus.disabled);

  const onFileChange = (type: any) => {
    console.log("Test");
    if (type === actionTypes.rightIcon) setStatus(fileStatus.success);
  };

  return (
    <ThemeProvider>
      <Box sx={{ width: 480 }}>
        <Fileupload
          label={"Upload document"}
          id={"uploaded"}
          status={status}
          onAction={onFileChange}
          description={"Success"}
          rightIcon={{ actionType: "loading", icon: IconNames.closeIcon }}
          helperText="Hello"
        />
      </Box>
    </ThemeProvider>
  );
};

export const BasicFileuploadedSkeleton = () => {
  const [status, setStatus] = useState(fileStatus.default);

  return (
    <ThemeProvider>
      <Box sx={{ width: 480 }}>
        <Fileupload
          label={"Upload document"}
          id={"uploaded"}
          status={status}
          onAction={() => {}}
          description={"Success"}
          isSkeleton
          rightIcon={{ actionType: "loading", icon: IconNames.closeIcon }}
        />
      </Box>
    </ThemeProvider>
  );
};
