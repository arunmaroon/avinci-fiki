import { makeStyles } from "tss-react/mui";

import { IconNames } from "@mvloans/base-ui.common";
import { projectTokens } from "@mvloans/base-ui.common";

import { AccordionProps } from "./accordion";
import { AccordianStates } from "./constants";
export const useStyles: Function = makeStyles<AccordionProps>()((theme, { state, iconName }) => {
  const { textAccordian, iconSizing, borderWidth, radius, sizing, spacing, semColors, color, card } = theme.tokens;

  const statusIconColorMap: { [key in AccordianStates]: string } = {
    [AccordianStates.error]: semColors.danger.icon.primary,
    [AccordianStates.success]: semColors.brand.icon.secondary,
    [AccordianStates.default]: "",
    [AccordianStates.saving]: "",
  };

  const statusIconColor = statusIconColorMap[state as AccordianStates];
  const accordionSummaryIconColor =
    iconName === IconNames.accordionDefaultUserIcon ? semColors.accent.icon.primary : textAccordian.icon.color;
  return {
    heading: {
      marginLeft: spacing.default,
      marginRight: spacing.default,
      flex: "1 1",
      "& p": {
        margin: spacing["4xCompact"],
      },
    },
    saving: {
      color: semColors.brand.background.cta,
    },
    savingBackground: {
      color: semColors.brand.border.primary,
    },
    circle: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: spacing.xCompact,
      width: sizing.small,
      height: sizing.small,
    },
    background: {
      position: "absolute",
      zIndex: 1,
    },
    foreground: {
      position: "absolute",
      zIndex: 2,
    },
    status: {
      color: `${statusIconColor}`,
      marginRight: spacing.xCompact,
      verticalAlign: "middle",
      height: iconSizing.medium,
      width: iconSizing.medium,
    },
    rootAccordian: {
      boxShadow: "none",
      padding: spacing.spacious,
      "&.MuiPaper-root": {
        margin: `${spacing["4xCompact"]}`,
      },
      "& .MuiAccordionSummary-root": {
        padding: spacing["4xCompact"],

        "&.MuiButtonBase-root": {
          minHeight: projectTokens.sizing[0],
        },
        "& .MuiAccordionSummary-content": {
          margin: `${spacing["4xCompact"]}`,
        },
        "& .MuiAccordionSummary-expandIconWrapper": {
          color: semColors.neutral.text.lowEmphasis,
        },
      },
      "& .MuiAccordionDetails-root": {
        padding: spacing["4xCompact"],
        marginTop: spacing.spacious,
      },
    },
    expandIconPosition: {
      "& .MuiAccordionSummary-expandIconWrapper": {
        alignSelf: "flex-start",
      },
    },
    disabled: {
      "&.MuiPaper-root": {
        background: "none",
      },

      "& .MuiAccordionSummary-root.Mui-disabled": {
        opacity: 1,
      },
      "& .MuiAccordionSummary-root": {
        "& .MuiAccordionSummary-expandIconWrapper": {
          display: "none",
        },
      },
    },
    accordionContainer: {
      position: "relative",
    },
    accordion: {
      borderRadius: radius.large,
      border: `${card.unselected.borderWidth.width} solid ${card.outlinedUnselected.border.color}`,
    },
    accordionDeselected: {
      borderRadius: radius.large,
      border: `${card.unselected.borderWidth.width} solid ${card.outlinedUnselected.border.color}`,
    },
    expanded: {
      border: `${card.selected.borderWidth.width} solid ${card.outlinedSelected.border.color}`,
      borderRadius: `${radius["2xLarge"]}`,
    },
    icon: {
      height: projectTokens.sizing[48],
    },
    iconSmall: {
      height: sizing.small,
    },
    accordionSummaryIcon: {
      color: accordionSummaryIconColor,
    },
    descriptionIcon: {
      color: textAccordian.icon.color,
      marginRight: spacing["2xCompact"],
      width: iconSizing.small,
      height: iconSizing.small,
    },
    description: {
      marginTop: spacing.xCompact,
      display: "flex",
      alignItems: "center",
    },
    chipClass: {
      position: "absolute",
      top: projectTokens.position["-12"],
      right: projectTokens.position[24],
      background: "linear-gradient(90deg, #09733E -32.26%, #2B73DE 119.89%)",
      zIndex: 1,
      height: sizing.small,
      maxWidth: sizing["4xLarge"],
    },
    container: {
      position: "relative",
    },
  };
});
