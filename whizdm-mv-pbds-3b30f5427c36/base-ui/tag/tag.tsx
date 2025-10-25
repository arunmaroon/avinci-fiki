//@ts-nocheck
import React from "react";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import {
  tagRecommended,
  tagCreditScore,
  tagApplicationStatus,
  tagTicketingStatus,
  defaultTagDarkSubVariant,
  tagType,
  defaultTagVariant,
  tagRecommendedVariant,
  tagCreditScoreVariant,
  tagApplicationStatusVariant,
  tagTicketingStatusVariant,
} from "./constants";
import { useStyles } from "./styles";
import { Chip } from "@mui/material";
import Typography from "@mvloans/base-ui.typography";
import { IconNames, TypographyVariants } from "@mvloans/base-ui.common";
import { MvSvgIcon } from "@mvloans/base-ui.mv-svg-icon";

export type TagProps = {
  type: tagType;
  variant?: defaultTagVariant | tagRecommendedVariant | tagCreditScoreVariant | tagApplicationStatusVariant | tagTicketingStatusVariant;
  subVariant?: defaultTagDarkSubVariant;
  label?: string;
  color?: string;
  suffixIcon?: IconNames;
  suffixIconColor?: string;
  onDelete?: Function;
};

export const Tag = ({ type, variant, subVariant, label, color, suffixIcon, onDelete, suffixIconColor }: TagProps) => {
  const { classes, cx, theme } = useStyles({ variant, suffixIconColor });
  const getIcon = (iconName: string) => {
    return (
      <MvSvgIcon
        className={classes.suffixIconColor}
        name={iconName}
        width={theme.tokens.sizing.xSmall}
        height={theme.tokens.sizing.xSmall}
      />
    );
  };
  return (
    <ThemeProvider>
      {
        {
          [tagType.DEFAULT]: (
            <Chip
              label={<Typography variant={TypographyVariants.bodyTinyHighEmphasis}>{label}</Typography>}
              className={cx(classes.chipRoot, classes[(variant ?? "") + (subVariant ?? "") + (color ?? "")])}
              deleteIcon={getIcon(suffixIcon)}
              onDelete={onDelete}
            />
          ),
          [tagType.TAG_RECOMMENDED]: (
            <Chip
              label={<Typography variant={TypographyVariants.bodyTinyHighEmphasis}>{tagRecommended?.[variant ?? ""]?.label}</Typography>}
              className={cx(classes.chipRoot, classes[tagRecommended?.[variant ?? ""]?.className])}
              deleteIcon={getIcon(suffixIcon)}
              onDelete={onDelete}
            />
          ),
          [tagType.TAG_APPLICATION_STATUS]: (
            <Chip
              label={
                <Typography variant={TypographyVariants.bodyTinyHighEmphasis}>{tagApplicationStatus?.[variant ?? ""]?.label}</Typography>
              }
              className={cx(classes.chipRoot, classes[tagApplicationStatus?.[variant ?? ""]?.className])}
              deleteIcon={getIcon(suffixIcon)}
              onDelete={onDelete}
            />
          ),
          [tagType.TAG_CREDIT_SCORE]: (
            <Chip
              label={<Typography variant={TypographyVariants.bodyTinyHighEmphasis}>{tagCreditScore?.[variant ?? ""]?.label}</Typography>}
              className={cx(classes.chipRoot, classes[tagCreditScore?.[variant ?? ""]?.className])}
              deleteIcon={getIcon(suffixIcon)}
              onDelete={onDelete}
            />
          ),
          [tagType.TAG_TICKETING_STATUS]: (
            <Chip
              label={
                <Typography variant={TypographyVariants.bodyTinyHighEmphasis}>{tagTicketingStatus?.[variant ?? ""]?.label}</Typography>
              }
              className={cx(classes.chipRoot, classes[tagTicketingStatus?.[variant ?? ""]?.className])}
              deleteIcon={getIcon(suffixIcon)}
              onDelete={onDelete}
            />
          ),
        }[type]
      }
    </ThemeProvider>
  );
};
