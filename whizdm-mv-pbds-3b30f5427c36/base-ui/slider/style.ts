import { makeStyles } from "tss-react/mui";
import { sliderVariants } from "./constants";
import { TypographyVariants } from "@mvloans/base-ui.common";

export const useStyles: Function = makeStyles<any>()((theme, props) => {
  const { variant, isAtStart, isAtEnd } = props;
  const { slider, borderWidth, typography, spacing, semColors, radius, shadow } = theme.tokens;
  const { filledTrackBackground, disabled, knobBackground, knobBorder, knob } = slider[variant as sliderVariants] as typeof slider.black;
  const { trackBackground, text, track, filledTrack } = slider;
  return {
    root: {
      borderRadius: radius.xSmall,
      '& .MuiSlider-markLabel[data-index="0"]': {
        transform: "translateX(0%)",
      },
      "& .MuiSlider-markLabel:nth-last-of-type(2)": {
        transform: "translateX(-100%)",
      },
      "& .MuiSlider-mark": {
        display: "none",
      },
      "&.Mui-disabled": {
        "& .MuiSlider-rail": {
          ...(variant === sliderVariants.BLACK && {
            backgroundColor: disabled.filledTrackBackground.color,
          }),
        },
        "& .MuiSlider-track": {
          backgroundColor: disabled.filledTrackBackground.color,
          border: "none",
        },

        "& .MuiSlider-thumb": {
          color: disabled.filledTrackBackground.color,
          "& path": {
            stroke: semColors.neutral.border.secondary,
          },
        },
      },
    },
    thumb: {
      color: knobBackground.color,
      border: `${borderWidth.medium} solid ${knobBorder?.color || "transparent"}`,
      width: knob.sizing,
      height: `calc(${knob.sizing} - 2px)`,
      boxShadow: shadow.enabledPrimary,
      ...(isAtStart && {
        transform: "translate(-10%, -50%)",
      }),
      ...(isAtEnd && {
        transform: "translate(-90%, -50%)",
      }),
      ":hover": {
        boxShadow: shadow.hoverPrimary,
      },
      ":focus": {
        outline: `${borderWidth.large} solid ${semColors.neutral.border.quinary}`,
        outlineOffset: borderWidth.large,
        boxShadow: shadow.pressedPrimary,
      },
      ":active": {
        boxShadow: shadow.pressedPrimary,
      },
      "&.Mui-focusVisible": {
        boxShadow: "none",
      },
      "& path": {
        stroke: slider.icon.color,
      },
    },
    track: {
      backgroundColor: filledTrackBackground.color,
      border: "none",
      height: filledTrack.sizing,
    },
    mark: {
      backgroundColor: "transparent",
    },
    rail: {
      backgroundColor: trackBackground.color,
      height: track.sizing,
      opacity: 1,
    },
    markLabel: {
      color: text.color,
      ...typography[text.typography as TypographyVariants],
      top: `calc(${spacing["2xSpacious"]} - 2px)}`,
    },
  };
});
