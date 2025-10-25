import { makeStyles } from "tss-react/mui";
import { TagProps } from "./tag";
import { projectTokens } from "@mvloans/base-ui.common";

export const useStyles: Function = makeStyles<TagProps>()((theme, { suffixIconColor }) => {
  const { tag, semColors, color: colorToken } = theme.tokens;
  return {
    chipRoot: {
      height: projectTokens.sizing[26],
    },
    darkprimarygreen: {
      background: tag.green.darkPrimary.background.color,
      color: tag.text.color,
    },
    darkprimaryyellow: {
      background: semColors.caution.background.quaternary,
      color: semColors.neutral.text.highEmphasisInverse,
    },
    darkprimaryorange: {
      background: tag.orange.darkPrimary.background.color,
      color: tag.text.color,
    },
    darkprimaryred: {
      background: tag.red.darkPrimary.background.color,
      color: tag.text.color,
    },
    darksecondarygreen: {
      background: tag.green.darkTertiary.background.color,
      color: tag.text.color,
    },
    lightgrey: {
      color: tag.grey.light.text.color,
      background: tag.grey.light.background.color,
    },
    lightgreen: {
      color: tag.green.light.text.color,
      background: tag.green.light.background.color,
    },
    lightblue: {
      color: tag.blue.light.text.color,
      background: tag.blue.light.background.color,
    },
    lightyellow: {
      background: tag.yellow.light.background.color,
      color: tag.yellow.light.text.color,
    },
    lightorange: {
      color: tag.orange.light.text.color,
      background: tag.orange.light.background.color,
    },
    lightred: {
      color: tag.red.light.text.color,
      background: tag.red.light.background.color,
    },
    gradientgreen: {
      background: colorToken.horizontalGradient01,
      color: tag.text.color,
    },
    gradientred: {
      background: colorToken.verticalGradient01, //todo
      color: tag.text.color,
    },
    suffixIconColor: {
      "&&": {
        color: suffixIconColor,
        "&:hover": {
          color: suffixIconColor,
        },
      },
    },
  };
});
