import { makeStyles } from "tss-react/mui";
import { projectTokens } from "@mvloans/base-ui.common";
import { StepperProps } from "./stepper";

export const useStyles: Function = makeStyles<StepperProps>()((theme, { steps }) => {
  const { semColors, spacing, sizing, borderWidth } = theme.tokens;
  return {
    iconContainer: {
      display: "flex",
      alignItems: "center",
    },
    divider: {
      position: "absolute",
      top: projectTokens.position[11],

      borderColor: semColors.brand.background.tertiary,
      // * Remove (8px + 1px) extra for the padding
      width: `calc(50% - ${sizing["2xSmall"]} - ${projectTokens.sizing[2]})`,
      borderBottomWidth: borderWidth.large,
    },
    disabledDivider: {
      borderColor: semColors.neutral.border.tertiary,
    },
    rightDivider: {
      right: projectTokens.position[0],
      borderTopLeftRadius: projectTokens.radius[1],
      borderBottomLeftRadius: projectTokens.radius[1],
    },
    leftDivider: {
      left: projectTokens.position[0],
      borderTopRightRadius: projectTokens.radius[1],
      borderBottomRightRadius: projectTokens.radius[1],
    },
    // * Remove (12px + 2px) extra for the padding
    widthClass12: {
      width: `calc(50% - ${projectTokens.sizing[12]} - ${projectTokens.sizing[2]})`,
    },
    avatarClass: {
      backgroundColor: semColors.brand.background.secondary,
    },
    iconClass16: {
      width: sizing.xSmall,
      height: sizing.xSmall,
    },
    iconClass24: {
      width: projectTokens.sizing[20],
      height: projectTokens.sizing[20],
      margin: spacing["3xCompact"],
    },
    padding1: {
      padding: projectTokens.spacing[1],
    },
    padding2: {
      padding: spacing["3xCompact"],
    },
    paddingTop1: {
      paddingTop: projectTokens.spacing[1],
    },
    paddingTop3: {
      paddingTop: projectTokens.spacing[3],
    },
    paddingTop4: {
      paddingTop: spacing["2xCompact"],
    },
    paddingTop5: {
      paddingTop: projectTokens.spacing[5],
    },

    stepperRoot: {
      "& .MuiStep-root": {
        width: `calc(100% / ${steps?.length ?? 1})`,
      },
      "& .MuiStepConnector-root": {
        left: `calc(-50% + ${projectTokens.position[10]})`,
        right: `calc(50% + ${projectTokens.position[10]})`,
      },
      "& .MuiStepLabel-label.MuiStepLabel-alternativeLabel": {
        marginTop: projectTokens.spacing[5],
        [theme.breakpoints.down("sm")]: {
          maxWidth: sizing.xLarge,
        },
      },
    },
    muiActiveLabelTopMargin1: {
      "& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel": {
        marginTop: projectTokens.spacing[1],
      },
    },
    muiCompletedLabelTopMargin1: {
      "& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel": {
        marginTop: projectTokens.spacing[1],
      },
    },
    muiActiveLabelTopMargin5: {
      "& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel": {
        marginTop: projectTokens.spacing[5],
      },
    },

    // iconAdjust* - Adjusts <MvSvgIcon /> to match the appearance of the old <Icon />

    iconAdjustStepperFilledSuccess: {
      color: semColors.brand.icon.secondary,
    },
    iconAdjustStepperUnFilledSuccess: {
      color: semColors.brand.icon.secondary,
    },
    iconAdjustStepperOutlineSuccess: {
      stroke: semColors.brand.icon.secondary,
      color: semColors.neutral.icon.primaryInverse,
    },
    iconAdjustStepperOutline: {
      stroke: semColors.neutral.border.tertiary,
      color: semColors.neutral.icon.primaryInverse,
    },
  };
});
