import { projectTokens } from "@mvloans/base-ui.common";
import { makeStyles } from "tss-react/mui";

export const useStyles: Function = makeStyles()((theme) => {
  const { spacing, sizing, fontWeight, dropdownListItem, dropdownList, borderWidth, semColors } = theme.tokens;

  return {
    root: {
      "& .MuiFilledInput-root": {
        "& .MuiAutocomplete-endAdornment": {
          right: projectTokens.spacing[16],
        },
      },
    },
    popper: {
      zIndex: 1300,
      [`&[data-popper-placement*="bottom"] .MuiPaper-root`]: {
        borderBottomLeftRadius: dropdownList.radius,
        borderBottomRightRadius: dropdownList.radius,
      },
      [`&[data-popper-placement*="top"] .MuiPaper-root`]: {
        borderTopLeftRadius: dropdownList.radius,
        borderTopRightRadius: dropdownList.radius,
      },
    },
    searchIcon: {
      color: semColors.neutral.icon.secondary,
    },
    iconClass: {
      width: sizing.small,
      height: sizing.small,
      verticalAlign: "middle",
      color: dropdownListItem.leftIcon.color,
    },
    options: {
      borderBottom: `${borderWidth.medium} solid ${semColors.neutral.border.primary}`,
      padding: `${spacing.default} ${spacing.spacious}`,
      width: "100%",
      display: "inline-flex",
      gap: spacing.compact,
      cursor: "pointer",
    },
    optionsLabel: {
      display: "inline-block",
    },
    option: {
      margin: spacing["4xCompact"],
      color: dropdownListItem.titleText.color,
    },
    groupLabel: {
      "& p": {
        display: "block",
        margin: spacing["4xCompact"],
        padding: `${spacing.spacious} ${spacing.spacious} ${spacing.xCompact}`,
      },
      "& p:empty": {
        padding: spacing["4xCompact"],
      },
    },
    groupOptions: {},
    rootPaper: {
      boxShadow: dropdownList.effect,
      backgroundColor: dropdownList.background.color,
      overflow: "hidden",
      "&& .MuiAutocomplete-listbox": {
        padding: spacing["4xCompact"],
        "& li:last-child > div": {
          borderBottom: "none",
        },
        "& .MuiAutocomplete-groupLabel:empty": {
          padding: spacing["4xCompact"],
        },
        "& li[aria-selected='true']": {
          backgroundColor: `${dropdownListItem.selected.background.color}`,
        },
        "& li[aria-selected='true'] > div > div > span": {
          fontWeight: fontWeight["semibold"],
        },
      },
      "& .MuiAutocomplete-option": {
        padding: `${spacing["4xCompact"]} ${spacing.spacious}`,
      },
    },
    rootInput: {
      "&& .MuiFilledInput-root": {
        color: semColors.neutral.text.mediumEmphasis,
        paddingRight: projectTokens.spacing[56],
        paddingTop: projectTokens.spacing[30],
        paddingLeft: `${spacing["4xCompact"]}`,
        "&.Mui-focused": {
          paddingRight: projectTokens.spacing[56],
          paddingTop: projectTokens.spacing[29],
          "& .MuiFilledInput-input": {
            paddingBottom: projectTokens.spacing[9],
          },
        },
        "& .MuiFilledInput-input": {
          padding: `${spacing["4xCompact"]} ${spacing["4xCompact"]} ${projectTokens.spacing[10]} ${spacing.default}`,
        },
      },
    },
    prefix: {
      top: projectTokens.spacing[20],
    },
    rootInputWithPrefix: {
      "&& .MuiInputLabel-filled": {
        paddingLeft: projectTokens.spacing[6],
      },
      "&& .MuiFilledInput-root": {
        "&& .MuiFilledInput-input": {
          paddingLeft: projectTokens.spacing[22],
        },
      },
    },
  };
});
