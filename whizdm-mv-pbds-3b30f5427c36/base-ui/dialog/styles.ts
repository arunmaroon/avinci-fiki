import { projectTokens } from "@mvloans/base-ui.common";
import { makeStyles } from "tss-react/mui";
export const useStyles: Function = makeStyles()((theme) => {
  const { sizing, radius, spacing, semColors } = theme.tokens;
  return {
    rootDialog: {
      "& .MuiBackdrop-root": {
        backgroundColor: semColors.neutral.background.septenary,
      },

      "& .MuiPaper-root": {
        width: sizing["6xLarge"],
        borderRadius: radius["2xLarge"],
        margin: spacing["4xCompact"],
        boxShadow: "none",
        boxSizing: "border-box",
        [theme.breakpoints.down("sm")]: {
          width: "100%",
          position: "absolute",
          bottom: spacing["4xCompact"],
          borderRadius: `${radius["2xLarge"]} ${radius["2xLarge"]} ${projectTokens.radius[0]} ${projectTokens.radius[0]}`,
        },
      },
    },

    rootBottomSheet: {
      "& .MuiDialogTitle-root": {
        padding: `${spacing.xSpacious} ${spacing.xSpacious} ${spacing["4xCompact"]}  ${spacing.xSpacious}`,
        [theme.breakpoints.down("sm")]: {
          padding: `${spacing.spacious} ${spacing.spacious} ${spacing["4xCompact"]}  ${spacing.spacious} `,
        },
      },
      "& .MuiDialogContent-root": {
        padding: `${spacing["4xCompact"]} ${spacing.xSpacious}`,
        [theme.breakpoints.down("sm")]: {
          padding: `${spacing["4xCompact"]} ${spacing.spacious}`,
        },
      },
      "& .MuiDialogActions-root": {
        padding: `${spacing["4xCompact"]} ${spacing.xSpacious} ${spacing.xSpacious} ${spacing.xSpacious}`,
        "& button": {
          textTransform: "none",
        },
        [theme.breakpoints.down("sm")]: {
          padding: `${spacing["4xCompact"]} ${spacing.spacious} ${spacing.spacious} ${spacing.spacious}`,
        },
      },
    },
    rootAlert: {
      "& .MuiPaper-root": {
        [theme.breakpoints.up("sm")]: {
          position: "absolute",
          top: spacing["2xSpacious"],
          borderRadius: radius["2xLarge"] /**For now it's set to 24px. In future, it will be set based on height */,
        },
        [theme.breakpoints.down("sm")]: {
          position: "relative",
          width: "100%",
          borderRadius: radius["2xLarge"],
          margin: spacing.xSpacious,
        },
      },

      "& .MuiDialogTitle-root": {
        padding: `${spacing.xSpacious} ${spacing.xSpacious} ${spacing["4xCompact"]} ${spacing.xSpacious}`,
        [theme.breakpoints.down("sm")]: {
          padding: `${spacing.spacious} ${spacing.spacious} ${spacing["4xCompact"]} ${spacing.spacious}`,
        },
      },
      "& .MuiDialogContent-root": {
        padding: `${spacing["4xCompact"]} ${spacing.xSpacious}`,
        [theme.breakpoints.down("sm")]: {
          padding: `${spacing["4xCompact"]} ${spacing.spacious}`,
        },
      },
      "& .MuiDialogActions-root": {
        padding: `${spacing["4xCompact"]} ${spacing.xSpacious} ${spacing.xSpacious} ${spacing.xSpacious}`,
        "& button": {
          textTransform: "none",
        },
        [theme.breakpoints.down("sm")]: {
          padding: `${spacing["4xCompact"]} ${spacing.spacious} ${spacing.spacious} ${spacing.spacious}`,
        },
      },
    },

    dialogTitleContainerWhenIconPresent: {
      "& .MuiDialogTitle-root": {
        padding: `${spacing.default} ${spacing.xSpacious} ${spacing["4xCompact"]} ${spacing.xSpacious}`,
        [theme.breakpoints.down("sm")]: {
          padding: `${spacing.default} ${spacing.spacious} ${spacing["4xCompact"]} ${spacing.spacious}`,
        },
      },
      "& .MuiDialogContent-root": {
        padding: `${spacing["4xCompact"]} ${spacing.xSpacious}`,
        [theme.breakpoints.down("sm")]: {
          padding: `${spacing["4xCompact"]} ${spacing.spacious}`,
        },
      },
      "& .MuiDialogActions-root": {
        padding: `${spacing["4xCompact"]} ${spacing.xSpacious} ${spacing.xSpacious} ${spacing.xSpacious}`,
        "& button": {
          textTransform: "none",
        },
        [theme.breakpoints.down("sm")]: {
          padding: `${spacing["4xCompact"]} ${spacing.spacious} ${spacing.spacious} ${spacing.spacious}`,
        },
      },
    },

    iconContainer: {
      padding: `${spacing.xSpacious} ${spacing.xSpacious} ${spacing["4xCompact"]}`,
      [theme.breakpoints.down("sm")]: {
        padding: `${spacing["2xSpacious"]} ${spacing.spacious} ${spacing["4xCompact"]}`,
      },
    },

    fullScreen: {
      "& .MuiPaper-root": {
        [theme.breakpoints.down("sm")]: {
          borderRadius: projectTokens.radius[0],
        },
      },
    },
    closeIconPosition: {
      position: "absolute",
      top: spacing.xSpacious,
      right: spacing.xSpacious,
      [theme.breakpoints.down("sm")]: {
        top: spacing.spacious,
        right: spacing.spacious,
      },
    },
    closeIcon: {
      padding: spacing.xCompact,
      boxSizing: "initial",
    },

    // iconStyleAdjustment - Adjusts <MvSvgIcon /> to match the appearance of the old <Icon />
    iconStyleAdjustment: {
      color: "rgb(128, 134, 139)",
    },
    subTitleSection: {
      display: "block",
      marginTop: spacing.xCompact,
      marginBottom: spacing["4xCompact"],
    },
    descriptionSection: {
      "&.MuiGrid-root": {
        marginTop: spacing.spacious,
      },
    },
    descriptionSectionAlert: {
      "&.MuiGrid-root": {
        marginTop: spacing.default,
      },
    },
    margin4XCompact: {
      margin: spacing["4xCompact"],
    },
    marginTopXSpacious: {
      marginTop: spacing.xSpacious,
    },
    marginTopSpacious: {
      marginTop: spacing.spacious,
    },
    pointer: {
      cursor: "pointer",
    },
    buttonContainer: {
      gap: spacing.default,
      justifyContent: "flex-end",
    },
    singleLine: {
      flexDirection: "row",
      "& button.MuiButtonBase-root ": {
        width: "auto",
      },
    },
    multiLine: {
      "&.MuiGrid-root": {
        flexDirection: "column",
        "& button": {
          width: "100%",
        },
      },
    },
    singleLineMobileFlip: {
      "&.MuiGrid-root": {
        [theme.breakpoints.down("sm")]: {
          flexDirection: "row-reverse",
          justifyContent: "flex-start",
        },
      },
    },
    singleLineDesktopFlip: {
      "&.MuiGrid-root": {
        [theme.breakpoints.up("sm")]: {
          flexDirection: "row-reverse",
          justifyContent: "flex-start",
        },
      },
    },
    multiLineMobileFlip: {
      "&.MuiGrid-root": {
        [theme.breakpoints.down("sm")]: {
          flexDirection: "column-reverse",
        },
      },
    },
    multiLineDesktopFlip: {
      "&.MuiGrid-root": {
        [theme.breakpoints.up("sm")]: {
          flexDirection: "column-reverse",
        },
      },
    },
    paddingTop6: {
      paddingTop: projectTokens.spacing[6],
    },
  };
});
