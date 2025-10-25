import { projectTokens, TypographyVariants } from "@mvloans/base-ui.common";
import { makeStyles } from "tss-react/mui";
import { TextFieldProps } from "./text-field";

export const useStyles: Function = makeStyles<TextFieldProps>()((theme, props: any) => {
  // todo[n]: should we export theme and tokens from palette?
  const { textInput, spacing, sizing, borderWidth, radius, semColors, fontWeight, color, typography, trailingLinkInput, dropdownListItem } =
    theme.tokens;
  const { labelText, inputText, helperText, filled, error, disabled, hover, background, border, active } = textInput;
  const labelTextTypography = labelText.typography;
  const inputTextTypography = inputText.typography;
  const helperTextTypography = helperText.typography;
  const shrinkLabelTextTypography = filled.labelText.typography;

  return {
    root: {
      width: "100%",
      // ? input base grp
      "& .MuiInputBase-input": {
        ...typography[inputTextTypography as TypographyVariants],
        boxSizing: "border-box",

        padding: `${projectTokens.spacing[30]} ${spacing.default} ${projectTokens.spacing[10]} ${spacing.default}`,
        "&.Mui-disabled": {
          WebkitTextFillColor: disabled.inputText.color,
        },
      },
      "& .MuiInputBase-root": {
        boxSizing: "border-box",
      },

      "&.Mui-focused": {
        backgroundColor: "transparent",
        borderWidth: borderWidth.large,
        borderColor: active.border.color,
        "& .MuiSelect-select": {
          paddingLeft: projectTokens.spacing[15],
          background: "transparent",
        },
        "& .MuiSelect-icon": {
          right: projectTokens.spacing[16],
        },
        "& .MuiSelect-select p": {
          marginRight: projectTokens.spacing[39],
        },
      },
      //
      "&.Mui-error": {
        backgroundColor: "transparent",
        borderColor: error.border.color,
      },
      // ? solo label filled
      // done // todo[n]: check doubt
      "& .MuiInputLabel-filled": {
        ...typography[labelTextTypography as TypographyVariants],
        color: labelText.color,
        paddingLeft: projectTokens.spacing[6],
        paddingTop: spacing["2xCompact"],
      },
      // ? solo helper text root
      // todo[n]: helper text can be combined into a single class
      // done
      "& .MuiFormHelperText-root": {
        ...typography[helperTextTypography as TypographyVariants],
        color: helperText.color,
        margin: `${spacing["2xCompact"]} ${spacing.default} ${spacing["4xCompact"]} ${spacing.default}`,
        "&.Mui-error": {
          "& span": {
            color: error.helperText.color,
          },
        },
      },

      // ? multiline groups
      // done
      "& .MuiInputBase-multiline": {
        padding: `${spacing["4xCompact"]}`,
        paddingBottom: `${spacing["2xCompact"]}`,
        marginBottom: `${spacing["2xCompact"]}`,
      },
      "& .MuiInputBase-multiline .Mui-focused": {
        marginBottom: projectTokens.spacing[3],
      },

      // ? focus groups
      // used to adjusting position when textbox is focussed. since it gives extra border thickness we do not want the text to move around (displace or flicker)
      "& input:focus": {
        paddingLeft: projectTokens.spacing[15],
      },
      "& textarea:focus": {
        paddingTop: projectTokens.spacing[29],
        paddingLeft: projectTokens.spacing[15],
      },

      // ? shrink grp solo
      // margin and padding for the shrink label text
      "& .MuiInputLabel-shrink": {
        ...typography[shrinkLabelTextTypography as TypographyVariants],
        color: labelText.color,
        paddingTop: projectTokens.spacing[6],
        marginTop: spacing["4xCompact"],
        transform: `translate(${spacing.compact}, ${spacing["2xCompact"]})`,
      },

      // ? filled group
      "& .MuiFilledInput-root": {
        backgroundColor: background.color,
        border: `${borderWidth.medium} solid ${border.color}`,
        overflow: "hidden",
        borderRadius: radius.medium,
        height: sizing["2xLarge"],
        paddingRight: spacing.default,
        // ? giving default height for multiline text
        "&.MuiInputBase-multiline": {
          height: "auto",
          "& textarea": {
            height: "unset",
            paddingTop: spacing["4xCompact"],
            marginTop: spacing["spacious"],
          },
        },

        "&:hover": {
          backgroundColor: "transparent",
          border: `${borderWidth.medium} solid ${hover.border.color}`,
        },

        "&:focus": {
          backgroundColor: "transparent",
          border: `${borderWidth.large} solid ${active.border.color}`,
        },

        "&.Mui-focused": {
          backgroundColor: "transparent",
          border: `${borderWidth.large} solid ${active.border.color}`,
          "& .MuiSelect-select": {
            paddingLeft: projectTokens.spacing[15],
            background: "transparent",
          },
          "& .MuiSelect-icon": {
            right: projectTokens.spacing[16],
          },
          "& .MuiSelect-select p": {
            marginRight: projectTokens.spacing[39],
          },
        },
        "&.Mui-error": {
          backgroundColor: "transparent",
          borderColor: error.border.color,
          "&:active": {
            borderWidth: borderWidth.large,
          },
          "&:focus": {
            borderWidth: borderWidth.large,
            borderColor: hover.border.color,
          },
        },
        "&.Mui-disabled": {
          backgroundColor: disabled.background.color,
          borderColor: trailingLinkInput.disabled.border.color,
          pointerEvents: "none",
          // ? unsure what this does
          "& .themeInputAdornment > .MuiSvgIcon-root": {
            color: disabled.inputText.color,
            cursor: "default",
          },
          // ? unsure what this does
          "& .themeInputAdornment > .MuiButton-root": {
            backgroundColor: disabled.background.color,
            cursor: "default",
          },
        },
        // ? unsure what the purpose of cursor pointer is
        "& .themeInputAdornment > .MuiTypography-caption": {
          paddingRight: projectTokens.spacing[10],
          cursor: "pointer",
        },
        // ? unsure what the purpose of cursor pointer is
        "& .themeInputAdornment > .MuiSvgIcon-root": {
          color: inputText.color,
          cursor: "pointer",
        },
        // done
        // ? placeholder color
        "& input::placeholder": {
          // todo[n]: check if inputTextTypography is required
          ...typography[inputTextTypography as TypographyVariants],
          color: labelText.color,
          opacity: 1,
          // todo[n]: check if paddingLeft is required
          paddingLeft: spacing["4xCompact"],
        },
        // ? unsure what this does
        "& .MuiSelect-select p": {
          WebkitLineClamp: "1",
          marginRight: spacing["2xSpacious"],
        },
        // ? unsure what this does
        "& .MuiSelect-icon": {
          right: projectTokens.spacing[16],
          top: `calc(50% - ${projectTokens.spacing[12]})`,
        },
      },
    },
    // done
    containerClass: {
      position: "relative",
    },
    // done
    prefixClass: {
      zIndex: 1,
      position: "absolute",
      top: spacing.spacious,
      left: spacing.default,
    },
    // done
    withPrefix: {
      "& .MuiInputLabel-filled, & .MuiFilledInput-input": {
        marginLeft: spacing.xSpacious,
      },
    },
    // done
    withPrefixAndAdornment: {
      "& .MuiInputBase-input, & .MuiInputBase-root": {
        paddingLeft: projectTokens.spacing[48],
      },
      "& .MuiInputBase-input.Mui-focused, & .MuiInputBase-root.Mui-focused": {
        paddingLeft: projectTokens.spacing[47],
      },
      "& .MuiInputLabel-filled": {
        marginLeft: spacing.xSpacious,
      },
      "&& .MuiInputAdornment-root.MuiInputAdornment-positionStart": {
        margin: `${projectTokens.spacing[20]} ${spacing["3xCompact"]} ${spacing["4xCompact"]}  ${spacing["4xCompact"]}`,
      },
      "& .MuiFilledInput-input": {
        paddingLeft: spacing["4xCompact"],
        marginLeft: spacing["4xCompact"],
      },
      "& input:focus": {
        paddingLeft: `${spacing["4xCompact"]}`,
      },
    },
    withstartAdornment: {
      "& .MuiInputBase-input, & .MuiInputBase-root": {
        paddingLeft: spacing.default,
      },
      "& .MuiInputBase-input.Mui-focused, & .MuiInputBase-root.Mui-focused": {
        paddingLeft: projectTokens.spacing[15],
      },
      "& .MuiFilledInput-input": {
        paddingLeft: spacing["4xCompact"],
        marginLeft: spacing["4xCompact"],
      },
      "& .MuiInputLabel-filled": {
        paddingLeft: spacing["4xCompact"],
        marginLeft: `${spacing["2xCompact"]}`,
      },
      "&& .MuiInputAdornment-root.MuiInputAdornment-positionStart": {
        margin: `${projectTokens.spacing[20]} ${spacing["3xCompact"]} ${spacing["4xCompact"]} ${spacing["4xCompact"]}`,
      },
      "& input:focus": {
        paddingLeft: spacing["4xCompact"],
      },
    },
    // done
    multilineRoot: {
      "& .MuiFormControl-root-MuiTextField-root .MuiFilledInput-root": {
        paddingLeft: spacing["spacious"],
      },
      "& .MuiInputBase-inputMultiline": {
        color: semColors.neutral.text.mediumEmphasis,
      },
    },
    // done
    multilineHelperTextClass: {
      display: "flex",
      justifyContent: "space-between",
    },
    // done
    helperTextClass: {
      paddingTop: spacing["4xCompact"],
      marginTop: spacing["4xCompact"],
      color: helperText.color,
    },

    success: {
      "& .MuiFilledInput-root": {
        border: `${borderWidth.medium} solid ${semColors.brand.text.secondary}`,

        "&:hover": {
          border: `${borderWidth.medium} solid ${semColors.brand.text.secondary}`,
        },
        "&.Mui-focused": {
          border: `${borderWidth.large} solid ${semColors.brand.text.secondary}`,
        },
      },
      "& .MuiFormHelperText-root": {
        // color: theme.palette.primary.dark,//color not present in pothos
      },
    },
    // done
    textfieldGrid: {
      width: "100%",
    },
    // done // todo[n]: 20px is not present in design token
    iconClass: {
      width: projectTokens.spacing[20],
      height: projectTokens.spacing[20],
      marginRight: spacing.default,
      verticalAlign: "middle",
    },
    // done
    listHeaderClass: {
      padding: `${spacing.spacious} ${spacing.spacious} ${spacing.xCompact}`,
      "& p": {
        margin: spacing["4xCompact"],
      },
    },
    // todo[n]: boxShadow not present in design token (why is 29 used?)
    paper: {
      boxShadow: `${spacing["4xCompact"]} ${spacing["2xCompact"]} ${projectTokens.spacing[20]} ${spacing["4xCompact"]} ${semColors.neutral.border.quinary}`,
      borderRadius: radius["2xLarge"],
      display: props?.selectProps?.hideOptions ? "none" : "block",
    },
    // done
    list: {
      padding: spacing["4xCompact"],
      "& .MuiMenuItem-root": {
        padding: `${spacing.default} ${spacing.spacious}`,
        overflow: "initial",
        backgroundColor: dropdownListItem.unselected.background.color,

        "&:hover": {
          backgroundColor: dropdownListItem.unselected.hover.background.color,
        },
      },
      "& .MuiMenuItem-root.Mui-selected": {
        // todo[n]: check why this is not given in textInput (it is in dropdown)
        backgroundColor: dropdownListItem.selected.background.color,
        "& p": {
          fontWeight: fontWeight.semibold,
        },
        "&:hover": {
          backgroundColor: dropdownListItem.selected.hover.background.color,
        },
      },
      "& .Mui-focusVisible": {
        backgroundColor: dropdownListItem.unselected.focused.background.color,
      },
    },
    // done
    options: {
      borderBottom: `${borderWidth.medium} solid ${semColors.neutral.border.primary}`,
      padding: `${spacing.default} ${spacing["4xCompact"]}`,
      width: "100%",
      display: "inline-flex",
    },
    // done
    optionsLabel: {
      display: "inline-block",
    },
    // done
    option: {
      margin: `${spacing["4xCompact"]}`,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "normal",
      display: "-webkit-box",
      WebkitLineClamp: "2",
      WebkitBoxOrient: "vertical",
      wordBreak: "break-all",
    },
    skeletonContainer: {
      display: "grid",
    },
    skeletonRoot: {
      height: `${sizing["2xLarge"]}`,
      width: "100%",
      background: semColors.neutral.background.secondary,
      borderRadius: spacing.compact,
    },
    skeletonRootOtp: {
      height: sizing.xLarge,
      width: sizing.xLarge,
    },
    skeletonChild: {
      width: sizing["2xLarge"],
      height: radius.xLarge,
      background: semColors.neutral.background.secondary,
      borderRadius: spacing.compact,
      margin: `${spacing["2xCompact"]} ${spacing.default} ${spacing["4xCompact"]} ${spacing.default}`,
    },
    searchIconPrefix: {
      marginTop: projectTokens.spacing["-5"],
    },
  };
});
