import { makeStyles } from "tss-react/mui";
import { projectTokens } from "@mvloans/base-ui.common";
export const useStyles: Function = makeStyles()((theme, { iconName }: any) => {
  const { spacing, alertCard, semColors, sizing } = theme.tokens;
  return {
    dialogContainer: {
      "& .MuiPaper-root": {
        borderRadius: alertCard.radius,
      },
      "& .MuiDialogContent-root": {
        position: "relative",
        width: projectTokens.sizing[312],
        boxSizing: "border-box",
        padding: iconName ? `${spacing["2xSpacious"]} ${spacing.spacious} ${spacing.spacious} ${spacing.spacious}` : spacing.spacious,

        [theme.breakpoints.up("sm")]: {
          width: sizing["6xLarge"],
          padding: `${spacing.xSpacious} ${spacing.xSpacious} ${spacing.spacious} ${spacing.xSpacious}`,
        },
      },

      "& .MuiDialogActions-root.MuiDialogActions-root": {
        padding: `${spacing["4xCompact"]} ${spacing.xSpacious} ${spacing.xSpacious} ${spacing.xSpacious}`,
        [theme.breakpoints.down("sm")]: {
          padding: `${spacing["4xCompact"]} ${spacing.spacious} ${spacing.spacious} ${spacing.spacious}`,
        },
      },
    },

    textField: {
      marginTop: spacing.default,
    },
    helperText: {
      "&&": {
        textAlign: "right",
      },
    },

    description: {
      color: alertCard.icon.color,
    },
    image: {
      marginBottom: spacing.default,
    },
    closeIcon: {
      position: "absolute",
      top: projectTokens.position[24],
      right: projectTokens.position[24],
      padding: spacing.xCompact,
      color: semColors.neutral.icon.secondary,
      height: sizing.large,
    },

    actionBtn: {
      width: "100%",
      "& button": {
        width: "100%",
      },
    },
    closeIconInWithoutImageVariant: {
      padding: spacing.xCompact,
      color: semColors.neutral.icon.secondary,
      height: sizing.large,
    },
  };
});
