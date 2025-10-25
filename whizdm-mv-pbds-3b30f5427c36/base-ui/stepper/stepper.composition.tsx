import React, { useState } from "react";
import { Stepper } from "./stepper";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import { Box } from "@mui/system";
import { useTheme } from "@mui/material/styles";
import { Snackbar } from "@mvloans/base-ui.snackbar";
import { IconNames, projectTokens } from "@mvloans/base-ui.common";
import { constants } from "./constants";

export const BasicStepper = () => {
  const { breakpoints } = useTheme();
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleStepperClick = (id: string) => {
    setShowSnackbar(true);
  };

  const steps = [
    {
      stepperKey: "incomeVerification",
      order: 1,
      label: "Income Verification",
      route: "getOffer",
      status: constants.COMPLETED,
    },
    {
      stepperKey: "planSelector",
      order: 2,
      label: "Select Plan",
      route: "selectPlan",
      status: constants.COMPLETED,
    },
    {
      stepperKey: "additionalDetails",
      order: 3,
      label: "Enter Details",
      route: "add-details",
      status: constants.ACTIVE,
    },
    {
      stepperKey: "kycVerification",
      order: 4,
      label: "Verify KYC",
      route: "kyc-select",
      status: constants.DISABLED,
    },
    {
      stepperKey: "uploadDocs",
      order: 5,
      label: "Upload documents",
      route: "upload-document",
      status: constants.DISABLED,
    },
  ];

  return (
    <ThemeProvider>
      <Box
        sx={{
          margin: `${projectTokens.spacing[30]} auto`,
          width: projectTokens.sizing[650],
          [breakpoints.down("sm")]: {
            width: "100%",
          },
        }}
      >
        <Stepper
          steps={steps}
          activeStepIndex={2}
          onStepClick={(id) => handleStepperClick(id)}
          controlSelectedKey={"planSelector"}
        />
      </Box>
      {showSnackbar && (
        <Snackbar
          message="The OnClick Returns a path to be redirected to depending on the current index"
          iconType={"info" as any}
        />
      )}
    </ThemeProvider>
  );
};

export const StepperWithCustomIcons = () => {
  const { breakpoints } = useTheme();
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleStepperClick = (id: string) => {
    setShowSnackbar(true);
  };

  const steps = [
    {
      stepperKey: "1",
      order: 1,
      label: "Personal details",
      route: "",
      status: constants.COMPLETED,
    },
    {
      stepperKey: "2",
      order: 2,
      label: "Choose loan offer on app",
      route: "",
      status: constants.COMPLETED,
    },
    {
      stepperKey: "3",
      order: 3,
      label: "Submit your application",
      route: "",
      status: constants.ACTIVE,
    },
    {
      stepperKey: "4",
      order: 4,
      label: "Get money in 10 mins",
      route: "",
      status: constants.DISABLED,
      iconName: IconNames.trustmarkerIcon,
    },
  ];

  return (
    <ThemeProvider>
      <Box
        sx={{
          margin: `${projectTokens.spacing[30]} auto`,
          width: projectTokens.sizing[650],
          [breakpoints.down("sm")]: {
            width: "100%",
          },
        }}
      >
        <Stepper
          steps={steps}
          activeStepIndex={2}
          onStepClick={(id) => handleStepperClick(id)}
          controlSelectedKey={"planSelector"}
        />
      </Box>
      {showSnackbar && (
        <Snackbar
          message="The OnClick Returns a path to be redirected to depending on the current index"
          iconType={"info" as any}
        />
      )}
    </ThemeProvider>
  );
};
