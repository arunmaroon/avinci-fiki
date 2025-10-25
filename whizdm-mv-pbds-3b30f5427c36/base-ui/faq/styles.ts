import { makeStyles } from "tss-react/mui";

export const useStyles: Function = makeStyles()((theme) => {
  const { textAccordian, spacing, semColors, borderWidth } = theme.tokens;
  const { titleText, descriptionText } = textAccordian;

  return {
    rootAccordianFaq: {
      padding: `${spacing.default} ${spacing["4xCompact"]}`,
      "& .MuiAccordionSummary-root": {
        "& .MuiAccordionSummary-expandIconWrapper": {
          alignSelf: "flex-start",
        },
      },
      "& .MuiAccordionDetails-root": {
        padding: `${spacing["4xCompact"]}`,
        marginTop: `${spacing.xCompact}`,
      },
    },
    headingFaq: {
      color: titleText.color,
      marginLeft: `${spacing["4xCompact"]}`,
      marginRight: `${spacing.default}`,
      flex: "1 1",
      "& p": {
        margin: `${spacing["4xCompact"]}`,
      },
    },
    faqAccordion: {
      borderBottom: `${borderWidth.medium} solid ${semColors.neutral.border.primary} `,
    },
    firstFaq: {
      paddingTop: `${spacing["4xCompact"]}`,
    },
    lastFaq: {
      paddingBottom: `${spacing["4xCompact"]}`,
    },
    lastFaqBorder: {
      border: "none",
    },
    description: {
      margin: `${spacing["4xCompact"]}`,
      color: descriptionText.color,
    },
  };
});
