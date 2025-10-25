import { makeStyles } from "tss-react/mui";

export const useStyles: Function = makeStyles<{ value: any }>()((theme, props) => {
  const { value } = props
  const { spacing, radius, sizing, uploadDocument, borderWidth, semColors } = theme.tokens;

  return {
    uploadContainer: {
      gap: spacing.default,
      padding: spacing.default,
      width: "100%",
    },
    uploadContainerBorderDashed: {
      cursor: "pointer",
      borderRadius: radius.large,
      backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='%23B9BABDFF' stroke-width='3' stroke-dasharray='8%2c12' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
      "&:hover": {
        backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='%23505259FF' stroke-width='3' stroke-dasharray='8%2c12' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
      }
    },
    uploadContainerBorderSolid: {
      borderRadius: uploadDocument.radius,
      border: `${borderWidth.medium} solid ${uploadDocument.border.color}`,
      "&:hover": {
        border: `${borderWidth.medium} solid ${uploadDocument.hover.border.color}`,
      },
    },
    verticalFileItem: {
      width: sizing.large,
      height: sizing.large,
      alignSelf: "center",
      cursor: "pointer",
    },
    uploadContainerErrorDashed: {
      cursor: "pointer",
      borderRadius: radius.large,
      backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='%23E12B1DFF' stroke-width='3' stroke-dasharray='8%2c12' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
    },
    uploadContainerErrorSolid: {
      borderRadius: uploadDocument.radius,
      border: `${borderWidth.medium} solid ${uploadDocument.uploadError.border.color}`,
    },
    heading: {
      flex: "1 1",
      flexDirection: "column",
      display: "flex",
      "& span": {
        wordBreak: "break-word",
      },
    },
    uploadStatus: {
      height: sizing.large,
      width: sizing.large,
      cursor: "pointer",
    },
    noDisplay: {
      display: "none",
    },
    fileUploadIconLabel: {
      height: sizing.large,
      width: sizing.large,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
    },
    "@global": {
      "@keyframes spin": {
        "0%": {
          transform: "rotate(0deg)",
        },
        "100%": {
          transform: "rotate(360deg)",
        },
      },
    },
    fileUploadIconRotate: {
      width: sizing.small,
      height: sizing.small,
      animation: "spin 2s linear infinite",
    },
    fileUploadIcon: {
      width: value ? sizing.large : sizing.xSmall,
      height: value ? sizing.large : sizing.xSmall,
    },
    fileDelete: {
      padding: spacing["4xCompact"],
      height: sizing.large,
      width: sizing.large,
    },
    labelClass: {
      margin: spacing["4xCompact"],
    },
    disabled: {
      overflow: "auto",
      backgroundColor: uploadDocument.disabled.background.color,
      cursor: "not-allowed",
      pointerEvents: "none",
      borderRadius: radius.large,
      border: value ? `${borderWidth.medium} solid ${semColors.neutral.border.secondary}` : "none",
    },
    cancelBtnText: {
      marginRight: spacing.default,
    },
    helperTextContainer: {
      margin: `${spacing["2xCompact"]} ${spacing.default} ${spacing["4xCompact"]} ${spacing.default}`,
    },
    skeletonRoot: {
      minHeight: sizing["3xLarge"],
      borderRadius: radius.large,
      background: semColors.neutral.background.secondary,
    },
    rightIconClass: {
      color: semColors.neutral.text.lowEmphasis,
    },
    leftIconFrame: {
      backgroundColor: semColors.neutral.background.secondary,
      width: sizing.large,
      height: sizing.large,
      padding: value ? spacing["4xCompact"] : spacing.compact,
      borderRadius: radius.small,
    }
  };
});
