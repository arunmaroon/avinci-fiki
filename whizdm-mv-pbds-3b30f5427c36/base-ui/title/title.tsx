import React from "react";
import { Box } from "@mui/material";
import Typography from "@mvloans/base-ui.typography";
import { useStyles } from "./styles";
import { TitleType } from "./constants";
import { TypographyVariants } from "@mvloans/base-ui.common";

export type TitleProps = {
  variant?: TitleType;
  title: string;
  subtitle?: string;
  classes?: {
    titleContainer?: string;
    titleText?: string;
    subtitleText?: string;
  };
};

export function Title({ variant = TitleType.Screen, title, subtitle, classes: propsClasses = {} }: TitleProps) {
  const { classes, cx, theme } = useStyles({ variant });
  const { title: titleToken } = theme.tokens;

  const getTitleVariant = (): TypographyVariants => {
    switch (variant) {
      case TitleType.Dialog:
        return TypographyVariants[titleToken.dialogTitleText.typography as TypographyVariants];

      case TitleType.Screen:
      default:
        return TypographyVariants[titleToken.screenTitleText.typography as TypographyVariants];
    }
  };

  return (
    <Box className={cx(classes.titleContainer, propsClasses.titleContainer)}>
      <Typography
        variant={getTitleVariant()}
        colorValue={titleToken.titleText.color}
        className={cx(classes.titleText, propsClasses.titleText)}>
        {title}
      </Typography>

      {subtitle && (
        <Typography
          variant={TypographyVariants[titleToken.descriptionText.typography as TypographyVariants]}
          colorValue={titleToken.descriptionText.color}
          className={cx(classes.subtitleText, propsClasses.subtitleText)}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
