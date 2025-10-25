import React, { ReactNode } from "react";

import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import { IconNames, projectTokens, TypographyVariants } from "@mvloans/base-ui.common";
import { MvSvgIcon } from "@mvloans/base-ui.mv-svg-icon";
import Typography from "@mvloans/base-ui.typography";

import { ConfigCard, ConfigObject } from "./config-card";
import { colorType, topRightElementType } from "./constants";
import { useStyles } from "./styles";

const ThemeProviderWrapper = ({ Component }: { Component: ReactNode }) => {
  return <ThemeProvider>{Component}</ThemeProvider>;
};

const BasicConfigCardWOTheme = () => {
  const { breakpoints } = useTheme();
  const { theme } = useStyles();
  const { sizing } = theme.tokens;
  const config: ConfigObject = {
    title: "Loan Application",
    description: "Continue your loan application to get a loan offer in few minutes",
    cardStatus: "active",
    topRightElement: {
      type: topRightElementType.CHIP,
      chipConfig: {
        label: "In Progress",
      },
    },
    // footer: "",
    cardAction: [
      {
        disabled: false,
        id: "1",
        children: "Continue",
      },
    ],
    avatar: 0,
    shouldHide: false,
  };
  // The onClick for the button
  const handleClickAction = (controlEl: any) => {
    if (controlEl === "Loan Application") {
      console.log("Button Clicked");
    }
  };

  return (
    <Box
      sx={{
        margin: `${projectTokens.spacing[30]} auto`,
        width: sizing["6xLarge"],
        [breakpoints.down("sm")]: {
          width: "100%",
        },
      }}>
      <ThemeProvider>
        <ConfigCard
          config={config}
          onClick={() => {
            handleClickAction("Loan Application");
          }}
          id={"basicConfigCard"}
          data-testid="basicConfigCard"
        />
      </ThemeProvider>
    </Box>
  );
};
const IncompleteConfigCardWOTheme = () => {
  const { breakpoints } = useTheme();
  const { theme } = useStyles();
  const { sizing } = theme.tokens;
  const config: ConfigObject = {
    title: "Loan Application",
    description: "Complete your loan application in few minutes to get a loan",
    cardStatus: "active",
    topRightElement: {
      type: topRightElementType.CHIP,
      chipConfig: {
        label: "Incomplete",
      },
    },
    footer: "06 Apr 22 | Loan ID: 149466970631",
    cardAction: [
      {
        id: "2",
        disabled: false,
        children: "Complete Now",
      },
    ],
    avatar: 0,
    shouldHide: false,
  };
  // The onClick for the button
  const handleClickAction = (controlEl: any) => {
    if (controlEl === "Loan Application") {
      console.log("Button Clicked");
    }
  };

  return (
    <Box
      sx={{
        margin: `${projectTokens.spacing[30]} auto`,
        width: sizing["6xLarge"],
        [breakpoints.down("sm")]: {
          width: "100%",
        },
      }}>
      <ThemeProvider>
        <ConfigCard
          config={config}
          onClick={() => {
            handleClickAction("Loan Application");
          }}
          id={"incompleteConfigCard"}
          data-testid="incompleteConfigCard"
        />
      </ThemeProvider>
    </Box>
  );
};
const InProgressConfigCardWOTheme = () => {
  const { breakpoints } = useTheme();
  const { theme } = useStyles();
  const { sizing } = theme.tokens;

  const config: ConfigObject = {
    title: "Document verification",
    description: "Your documents are being verified. Please check back in sometime",
    cardStatus: "active",
    topRightElement: {
      type: topRightElementType.CHIP,
      chipConfig: {
        label: "In progress",
      },
    },
    // footer: "",
    cardAction: [
      {
        id: "3",
        disabled: false,
        children: "Resubmit Documents",
      },
    ],
    avatar: 0,
    shouldHide: false,
  };
  // The onClick for the button
  const handleClickAction = (controlEl: any) => {
    if (controlEl === "Loan Application") {
      console.log("Button Clicked");
    }
  };

  return (
    <Box
      sx={{
        margin: `${projectTokens.spacing[30]} auto`,
        width: sizing["6xLarge"],
        [breakpoints.down("sm")]: {
          width: "100%",
        },
      }}>
      <ThemeProvider>
        <ConfigCard
          config={config}
          onClick={() => {
            handleClickAction("Loan Application");
          }}
          id={"inProgressConfigCard"}
          data-testid="inProgressConfigCard"
        />
      </ThemeProvider>
    </Box>
  );
};
const PendingConfigCardWOTheme = () => {
  const { breakpoints } = useTheme();
  const { theme } = useStyles();
  const { sizing, semColors } = theme.tokens;
  const config: ConfigObject = {
    title: "Loan Application",
    description: (
      <Typography variant={TypographyVariants.bodySmallLowEmphasis} colorValue={semColors.neutral.text.mediumEmphasis}>
        Upload your work ID, latest payslip, or latest month’s statement of your salary account. You can also mail it to{" "}
        <b>documents@moneyview.in</b>
      </Typography>
    ),
    cardStatus: "error",
    topRightElement: {
      type: topRightElementType.CHIP,
      chipConfig: {
        label: "Pending",
      },
    },
    // footer: "",
    cardAction: [
      {
        id: "4",
        disabled: false,
        children: "Upload Now",
      },
    ],
    avatar: 0,
    shouldHide: false,
  };
  // The onClick for the button
  const handleClickAction = (controlEl: any) => {
    if (controlEl === "Loan Application") {
      console.log("Button Clicked");
    }
  };

  return (
    <Box
      sx={{
        margin: `${projectTokens.spacing[30]} auto`,
        width: sizing["6xLarge"],
        [breakpoints.down("sm")]: {
          width: "100%",
        },
      }}>
      <ThemeProvider>
        <ConfigCard
          config={config}
          onClick={() => {
            handleClickAction("Loan Application");
          }}
          id={"errorConfigCard"}
          data-testid="errorConfigCard"
        />
      </ThemeProvider>
    </Box>
  );
};

const ResubmitConfigCardWOTheme = () => {
  const { breakpoints } = useTheme();
  const { theme } = useStyles();
  const { sizing, semColors } = theme.tokens;
  const config: ConfigObject = {
    title: "Document verification",
    description: (
      <Typography variant={TypographyVariants.bodySmallLowEmphasis} colorValue={semColors.neutral.text.mediumEmphasis}>
        <b>3 documents</b> needs re-submission. Upload to complete application
      </Typography>
    ),
    cardStatus: "error",
    topRightElement: {
      type: topRightElementType.CHIP,
      chipConfig: {
        label: "Resubmit",
      },
    },
    footer: "Note: Make sure the documents are clear and readable",
    cardAction: [
      {
        id: "5",
        disabled: false,
        children: "Resubmit",
      },
    ],
    avatar: 0,
    shouldHide: false,
  };
  // The onClick for the button
  const handleClickAction = (controlEl: any) => {
    if (controlEl === "Loan Application") {
      console.log("Button Clicked");
    }
  };

  return (
    <Box
      sx={{
        margin: `${projectTokens.spacing[30]} auto`,
        width: sizing["6xLarge"],
        [breakpoints.down("sm")]: {
          width: "100%",
        },
      }}>
      <ThemeProvider>
        <ConfigCard
          config={config}
          onClick={() => {
            handleClickAction("Loan Application");
          }}
          id={"resubmitConfigCard"}
          data-testid="resubmitConfigCard"
        />
      </ThemeProvider>
    </Box>
  );
};
const LoadingConfigCardWOTheme = () => {
  const { breakpoints } = useTheme();
  const { theme } = useStyles();
  const { sizing } = theme.tokens;
  const config: ConfigObject = {
    title: "Submitting application",
    description: "Please wait while we upload documents",
    cardStatus: "loading",
    // footer: "",
    cardAction: [
      {
        id: "6",
        disabled: false,
        children: "Continue",
      },
    ],
    avatar: 0,
    shouldHide: false,
  };
  // The onClick for the button
  const handleClickAction = (controlEl: any) => {
    if (controlEl === "Loan Application") {
      console.log("Button Clicked");
    }
  };

  return (
    <Box
      sx={{
        margin: `${projectTokens.spacing[30]} auto`,
        width: sizing["6xLarge"],
        [breakpoints.down("sm")]: {
          width: "100%",
        },
      }}>
      <ThemeProvider>
        <ConfigCard
          config={config}
          onClick={() => {
            handleClickAction("Loan Application");
          }}
          id={"loadingConfigCard"}
          data-testid="loadingConfigCard"
        />
      </ThemeProvider>
    </Box>
  );
};
const CompletedConfigCardWOTheme = () => {
  const { breakpoints } = useTheme();
  const { theme } = useStyles();
  const { sizing } = theme.tokens;
  const config: ConfigObject = {
    title: "Plan selected",
    description: "₹65,000 for 9 months",
    cardStatus: "completed",
    topRightElement: {
      type: topRightElementType.ACTION,
      actionConfig: {
        key: "2",
        label: "Edit",
      },
    },
    // footer: "",
    cardAction: [
      {
        id: "7",
        disabled: false,
        children: "Continue",
      },
    ],
    avatar: 3,
    shouldHide: false,
  };
  // The onClick for the button
  const handleClickAction = (controlEl: any) => {
    if (controlEl === "Loan Application") {
      console.log("Button Clicked");
    }
  };

  return (
    <Box
      sx={{
        margin: `${projectTokens.spacing[30]} auto`,
        width: sizing["6xLarge"],
        [breakpoints.down("sm")]: {
          width: "100%",
        },
      }}>
      <ThemeProvider>
        <ConfigCard
          config={config}
          onClick={() => {
            handleClickAction("Loan Application");
          }}
          id={"completedConfigCard"}
          data-testid="completedConfigCard"
        />
      </ThemeProvider>
    </Box>
  );
};
const DisabledConfigCardWOTheme = () => {
  const { breakpoints } = useTheme();
  const { theme } = useStyles();
  const { sizing } = theme.tokens;
  const config: ConfigObject = {
    title: "Enable EMI Auto-Debit (NACH)",
    cardStatus: "disabled",
    // footer: "",
    avatar: 3,
    shouldHide: false,
  };
  // The onClick for the button
  const handleClickAction = (controlEl: any) => {
    if (controlEl === "Loan Application") {
      console.log("Button Clicked");
    }
  };

  return (
    <Box
      sx={{
        margin: `${projectTokens.spacing[30]} auto`,
        width: sizing["6xLarge"],
        [breakpoints.down("sm")]: {
          width: "100%",
        },
      }}>
      <ThemeProvider>
        <ConfigCard
          config={config}
          onClick={() => {
            handleClickAction("Loan Application");
          }}
          id={"disabledConfigCard"}
          data-testid="disabledConfigCard"
        />
      </ThemeProvider>
    </Box>
  );
};

const NoAvatarConfigCardWOTheme = () => {
  const { classes, theme } = useStyles();
  const { breakpoints } = useTheme();
  const { sizing } = theme.tokens;

  const config: ConfigObject = {
    title: (
      <Typography className={classes.jusitfyCenter} variant={TypographyVariants.bodyMediumHighEmphasis}>
        Total EMI of ₹7,317 is overdue
        <MvSvgIcon
          name={IconNames.infoIcon}
          width={sizing.xSmall}
          height={sizing.xSmall}
          style={{
            verticalAlign: "middle",
          }}
        />
      </Typography>
    ),
    description: "Please pay now to avoid drop in CIBIL score",
    cardStatus: "error",
    topRightElement: {
      type: topRightElementType.CHIP,
      chipConfig: {
        label: "Overdue",
      },
    },
    cardAction: [
      {
        id: "1",
        disabled: false,
        children: "Pay Now",
      },
    ],
    shouldHide: false,
  };
  // The onClick for the button
  const handleClickAction = (controlEl: any) => {
    if (controlEl === "Pay Now") {
      console.log("Button Clicked");
    }
  };

  return (
    <Box
      sx={{
        margin: `${projectTokens.spacing[30]} auto`,
        width: sizing["6xLarge"],
        [breakpoints.down("sm")]: {
          width: "100%",
        },
      }}>
      <ConfigCard
        config={config}
        onClick={() => {
          handleClickAction("Pay Now");
        }}
        id={"noAvatarConfigCard"}
        data-testid="noAvatarConfigCard"
        classes={{
          chip: classes[colorType.resubmitChipBckColor],
          chipTypography: classes[colorType.resubmitChipTextColor],
        }}
      />
    </Box>
  );
};

export const BasicConfigCard = () => <ThemeProviderWrapper Component={<BasicConfigCardWOTheme />} />;
export const IncompleteConfigCard = () => <ThemeProviderWrapper Component={<IncompleteConfigCardWOTheme />} />;
export const InProgressConfigCard = () => <ThemeProviderWrapper Component={<InProgressConfigCardWOTheme />} />;
export const PendingConfigCard = () => <ThemeProviderWrapper Component={<PendingConfigCardWOTheme />} />;
export const ResubmitConfigCard = () => <ThemeProviderWrapper Component={<ResubmitConfigCardWOTheme />} />;
export const LoadingConfigCard = () => <ThemeProviderWrapper Component={<LoadingConfigCardWOTheme />} />;
export const CompletedConfigCard = () => <ThemeProviderWrapper Component={<CompletedConfigCardWOTheme />} />;
export const DisabledConfigCard = () => <ThemeProviderWrapper Component={<DisabledConfigCardWOTheme />} />;
export const NoAvatarConfigCard = () => <ThemeProviderWrapper Component={<NoAvatarConfigCardWOTheme />} />;
