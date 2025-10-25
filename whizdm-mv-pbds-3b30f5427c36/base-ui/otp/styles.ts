import { makeStyles } from "tss-react/mui";
import { OtpProps } from "./otp";
import { projectTokens } from "@mvloans/base-ui.common";

export const useStyles: Function = makeStyles<OtpProps>()((theme, props) => {
  const { spacing, codeInputCell, sizing, semColors, borderWidth, lineHeight, fontSize } = theme.tokens;

  return {
    gridClassMore: {
      margin: spacing["4xCompact"],
      gap: spacing.xCompact,
    },
    gridClass: {
      margin: spacing["4xCompact"],
      gap: spacing.compact,
    },
    inputClass: {
      "& .Mui-disabled": {
        backgroundColor: codeInputCell.disabled.background.color,
        borderColor: codeInputCell.disabled.border.color,
      },
      "& .MuiFilledInput-root": {
        borderRadius: spacing.compact,
        border: `${borderWidth.medium} solid ${codeInputCell.border.color}`,
        height: sizing.xLarge,
        padding: `${spacing["xCompact"]}`,
        "&&.Mui-focused": {
          border: `${borderWidth.large} solid ${semColors.neutral.border.quinary}`,
        },
      },
      "&& .MuiFilledInput-input": {
        padding: `${spacing["4xCompact"]}`,
        background: "none",
        lineHeight: lineHeight[200],
        textAlign: "center",
        color: codeInputCell.text.color,
      },
    },
    inputClassForFour: {
      width: sizing.xLarge,
    },
    inputClassSmaller: {
      "& .MuiFilledInput-root": {
        borderRadius: spacing.xCompact,
        height: projectTokens.sizing[48],
        border: `${borderWidth.medium} solid ${codeInputCell.border.color}`,
      },
    },
    errorClass: {
      "& .MuiFilledInput-root": {
        border: `${borderWidth.medium} solid ${codeInputCell.error.border.color}`,
        "&.Mui-focused": {
          border: `${borderWidth.large} solid ${codeInputCell.error.border.color}`,
        },
      },
    },
    errorClassSmaller: {
      height: projectTokens.sizing[48],
      "& .MuiFilledInput-root": {
        borderRadius: spacing.xCompact,
        border: `${borderWidth.medium} solid ${codeInputCell.error.border.color}`,
        "&.Mui-focused": {
          border: `${borderWidth.large} solid ${codeInputCell.error.border.color}`,
        },
      },
    },
    errorSelectedClass: {
      "& .MuiFilledInput-root": {
        border: `${borderWidth.large} solid ${codeInputCell.error.border.color}`,
      },
    },
    bottomRoot: {
      margin: spacing["4xCompact"],
      display: "flex",
      justifyContent: "space-between",
    },
  };
});
