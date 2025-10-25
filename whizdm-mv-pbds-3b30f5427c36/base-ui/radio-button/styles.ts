import { TypographyVariants } from "@mvloans/base-ui.common";
import { makeStyles } from "tss-react/mui";

export const useStyles: Function = makeStyles()((theme, props: any) => {
  const { row } = props;
  const { sizing, spacing, radius, radio, radioList, typography, radioListItem, borderWidth, semColors } = theme.tokens;
  return {
    formControlClass: {
      width: "100%",
      height: "100%",

      "& .MuiFormControlLabel-root": {
        padding: `${spacing["2xCompact"]} 0`,
        margin: 0,
        ...(row && { marginRight: spacing["2xSpacious"] }),
        ...(!row && { paddingBlock: spacing.compact, padding: spacing["4xCompact"] }),
      },
    },
    iconClass: {
      borderRadius: radius.round,
      width: sizing.small,
      height: sizing.small,
    },

    titleClass: {
      "&&": {
        color: radioList.title.text.color,
        marginBottom: spacing["2xCompact"],
      },
    },

    errorClass: {
      "&&": {
        color: radioList.error.text.color,
        marginBottom: spacing.compact,
      },
    },

    gridContainer: {
      width: "100%",
      cursor: "pointer",
    },

    childrenContainer: {
      paddingLeft: spacing["2xSpacious"],
      marginTop: spacing.default,
      marginBottom: spacing.default,
    },

    labelIconClass: {
      width: sizing.large,
      height: sizing.large,
      background: radioListItem.trailingSelected.icon.background.color,
      borderRadius: radius.medium,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    nonSelectedIconClass: {
      background: "transparent",
    },

    radioClass: {
      "&&": {
        padding: 0,

        color: radio.unselected.border.color,
        "&:hover": {
          color: radio.unselected.hover.border.color,
        },
        "&.Mui-disabled": {
          color: radio.unselected.disabled.border.color,
          "& + .MuiFormControlLabel-label": {
            color: radioListItem.disabled.text.color,
          },
        },
        "&:active": {
          color: radio.unselected.pressed.border.color,
        },
        "&:focus-visible": {
          outline: `${borderWidth.large} solid ${semColors.neutral.border.quinary}`,
          outlineOffset: borderWidth.large,
        },
        "&.Mui-checked": {
          color: radio.selected.border.color,
          "&:hover": {
            color: radio.selected.hover.border.color,
          },
          "&.Mui-disabled": {
            color: radio.selected.disabled.border.color,
          },
          "&:active": {
            color: radio.selected.pressed.border.color,
          },
          "& + .MuiFormControlLabel-label": {
            ...typography[radioListItem.selected.text.typography as TypographyVariants],
          },
        },
      },
    },
    labelClass: {
      "& .MuiFormControlLabel-label": {
        marginLeft: spacing.default,
        ...typography[radioListItem.unselected.text.typography as TypographyVariants],
        color: radioListItem.text.color,
      },
      "& .MuiRadio-root": {
        alignSelf: "start ",
      },
      "&:hover .MuiRadio-root": {
        color: radio.unselected.hover.border.color,
      },

      "&:hover .Mui-checked": {
        color: radio.selected.hover.border.color,
      },
      "&:hover .Mui-disabled": {
        color: radio.unselected.disabled.border.color,
      },
    },

    selectedWithPrefixIconClass: {
      color: radioListItem.trailingSelected.icon.color,
    },
    nonSelectedWithPrefixIconClass: {
      color: radioListItem.trailingUnselected.icon.color,
    },

    prefixLabelClass: {
      "&&": {
        flex: "1 1",
        marginLeft: spacing.default,
      },
    },
    radioIconLeftPadding: {
      "&&": {
        paddingLeft: spacing.spacious,
      },
    },
  };
});
