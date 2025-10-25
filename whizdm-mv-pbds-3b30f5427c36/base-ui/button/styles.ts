import { makeStyles } from "tss-react/mui";

import { variantConstants } from "@mvloans/base-ui.common";
import { ButtonProps } from "./button";

import { buttonVariantConstants } from "./constants";
import { extractEffect, extractPropertyColor } from "./utils";

export const useStyles: Function = makeStyles<ButtonProps>()((theme, props) => {
  const { variant, size, isSkeleton, isLoading } = props;

  const { button, semColors, borderWidth, spacing, sizing } = theme.tokens;

  const { sizing: buttonSizing, small } = button;

  const {
    background,
    hover,
    disabled,
    text,
    icon,
    pressed,
    border,
    sizing: variantSizing,
  } = (button[variant as buttonVariantConstants] || button.primary) as typeof button.supportPrimary &
    typeof button.dangerPrimary &
    typeof button.link &
    typeof button.primary;

  const backgroundColor = extractPropertyColor(background);
  const hoverBackgroundColor = extractPropertyColor(hover?.background);
  const hoverEffect = extractEffect(hover);
  const disabledBackgroundColor = extractPropertyColor(disabled?.background);
  const disabledColor = extractPropertyColor(disabled?.text);
  const disabledIconColor = extractPropertyColor(disabled?.icon);
  const textColor = extractPropertyColor(text);
  const iconColor = extractPropertyColor(icon);
  const pressedEffect = extractEffect(pressed);
  const borderColor = extractPropertyColor(border);
  const pressedBackgroundColor = pressed?.background?.color;

  if (isSkeleton) {
    return {
      root: {
        "&&": {
          width: "100%",
          height: buttonSizing,
          ...(size === variantConstants.BUTTONSMALL && { height: small.sizing }),
          ...(variant === buttonVariantConstants.LINK && { height: variantSizing, color: semColors.neutral.text.highEmphasis }),
          minWidth: sizing["4xLarge"],
          borderRadius: button.radius,
          ...(size === variantConstants.BUTTONSMALL && { borderRadius: small.radius }),
          backgroundColor: semColors.neutral.background.secondary,
          padding: `${spacing["4xCompact"]} ${spacing.spacious}`,
        },
      },
    };
  }
  if (isLoading) {
    return {
      root: {
        "&&": {
          width: "100%",
          backgroundColor,
          border: `${borderWidth.medium} solid ${borderColor}`,
          ".MuiLoadingButton-loadingIndicator": {
            color: textColor,
            ".MuiCircularProgress-root": {
              width: sizing.small,
              height: sizing.small,
            },
          },
          height: buttonSizing,
          padding: `${spacing["4xCompact"]} ${spacing.spacious}`,
          ...(size === variantConstants.BUTTONSMALL && { height: small.sizing }),
          ...(variant === buttonVariantConstants.LINK && { height: variantSizing, color: semColors.neutral.text.highEmphasis }),
          minWidth: sizing["4xLarge"],
          borderRadius: button.radius,
          ...(size === variantConstants.BUTTONSMALL && { borderRadius: small.radius }),
        },
      },
    };
  }
  return {
    root: {
      "&&": {
        width: "100%",
        backgroundColor,
        border: `${borderWidth.medium} solid ${borderColor}`,
        "&:hover": {
          backgroundColor: hoverBackgroundColor,
          boxShadow: hoverEffect,
          ...(variant === buttonVariantConstants.SUPPORT_PRIMARY && { border: `${borderWidth.large} solid ${borderColor}` }),
        },
        "&:disabled": {
          backgroundColor: disabledBackgroundColor,
          color: disabledColor,
          "& .MuiButton-icon": {
            color: disabledIconColor,
          },
        },
        color: textColor,
        "& .MuiButton-icon": {
          color: iconColor,
        },
        "&:active": {
          boxShadow: pressedEffect,
          backgroundColor: pressedBackgroundColor,
        },
        "&:focus-visible": {
          outline: `${borderWidth.large} solid ${semColors.neutral.border.quinary}`,
          outlineOffset: borderWidth.large,
        },
        height: buttonSizing,
        padding: `${spacing["4xCompact"]} ${spacing.spacious}`,
        ...(size === variantConstants.BUTTONSMALL && { height: small.sizing }),
        ...(variant === buttonVariantConstants.LINK && { height: variantSizing, color: semColors.neutral.text.highEmphasis }),
        minWidth: sizing["4xLarge"],
        borderRadius: button.radius,
        ...(size === variantConstants.BUTTONSMALL && { borderRadius: small.radius }),
        textTransform: "none",
      },
    },
  };
});
