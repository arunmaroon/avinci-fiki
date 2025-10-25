import { makeStyles } from "tss-react/mui";
import { projectTokens } from "@mvloans/base-ui.common";
import { pennyItemVariant } from "./constants";

export const useStyles: Function = makeStyles<any, any>()((theme, props) => {
  if (!props) return;
  const { variant } = props;
  const { sizing, color, semColors, radius } = theme.tokens;
  if (variant === pennyItemVariant.ICON) {
    return {
      container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: projectTokens.sizing[48],
        height: projectTokens.sizing[48],
        background: semColors.accent.background.tertiary,
        borderRadius: radius.round,

        "& svg": {
          color: semColors.neutral.text.highEmphasisInverse,
          width: sizing.small,
          height: sizing.small,
        },
      },

      circle: {
        borderRadius: radius.round,
      },
      square: {
        borderRadius: radius.small,
      },

      small: {
        width: sizing.large,
        height: sizing.large,
        "& svg": {
          width: sizing.xSmall,
          height: sizing.xSmall,
        },
      },
    };
  }

  if (variant === pennyItemVariant.NUMBER) {
    return {
      container: {
        width: sizing.small,
        height: sizing.small,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: semColors.neutral.background.tertiary,
        color: semColors.neutral.text.mediumEmphasis,
        borderRadius: radius.round,
      },

      enabled: {
        background: semColors.neutral.background.tertiary,
        color: semColors.neutral.text.mediumEmphasis,
      },
      active: {
        background: semColors.neutral.background.septenary,
        color: semColors.neutral.text.highEmphasisInverse,
      },
      disabled: {
        background: semColors.neutral.background.tertiary,
        color: semColors.neutral.text.lowEmphasis,
      },
    };
  }

  if (variant === pennyItemVariant.PROFILE) {
    return {
      container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: projectTokens.sizing[48],
        height: projectTokens.sizing[48],
        background: semColors.brand.background.cta,
        borderRadius: radius.round,
        color: semColors.neutral.text.highEmphasisInverse,
        opacity: 0.9,
        overflow: "hidden",
      },

      icon: {
        width: projectTokens.sizing[48],
        height: projectTokens.sizing[48],
        color: semColors.brand.background.quinary,
      },
    };
  }
});
