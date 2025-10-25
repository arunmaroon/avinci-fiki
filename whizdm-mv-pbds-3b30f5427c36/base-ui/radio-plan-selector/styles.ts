import { projectTokens } from "@mvloans/base-ui.common";
import { makeStyles } from "tss-react/mui";

export const useStyles: Function = makeStyles()((theme) => {
  const { sizing, semColors, spacing, fontSize, lineHeight, borderWidth } = theme.tokens;
  return {
    iconClass: {
      borderRadius: "50%",
      width: sizing.small,
      height: sizing.small,
    },
    formControl: {
      width: "100%",
      maxWidth: sizing["6xLarge"],
    },
    rowBorder: {
      borderBottom: `${borderWidth.medium} solid ${semColors.neutral.border.primary}`,
    },
    paddingBlock16: {
      paddingBlock: spacing.default,
    },
    marginBottom4: {
      marginBottom: spacing["2xCompact"],
    },
    formGrid: {
      alignItems: "flex-start",
      justifyContent: "space-between",
    },
    withoutPrefixLabelClass: {
      alignItems: "flex-start",
      "& .MuiFormControlLabel-label": {
        marginLeft: spacing.default,
        fontWeight: "400",
        fontSize: fontSize[100],
        lineHeight: lineHeight[100],
        //@ts-ignore
        color: semColors.neutral.text.highEmphasis,
      },
      "&.MuiFormControlLabel-root": {
        marginRight: `${spacing["4xCompact"]}`,
        marginLeft: `${spacing["4xCompact"]}`,
      },
      "&:first-of-type": {},
    },
    withoutPrefixRadioClass: {
      padding: spacing["4xCompact"],
    },
    fontWeightBold: {
      "&": {
        fontWeight: "600",
      },
    },
    marginLeft40: {
      marginLeft: spacing["2xSpacious"],
    },
    marginTop4: {
      marginTop: spacing["2xCompact"],
    },
    displayCardClass: {
      textAlign: "right",
      height: `${projectTokens.sizing[20]}`,
    },
    showCards: {
      paddingLeft: spacing["2xCompact"],
      verticalAlign: "middle",
    },
  };
});
