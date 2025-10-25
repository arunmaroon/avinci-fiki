import React from "react";
import { Grid } from "@mui/material";
import Typography from "@mvloans/base-ui.typography";
import { TypographyVariants } from "@mvloans/base-ui.common";
import { MvSvgIcon } from "@mvloans/base-ui.mv-svg-icon";
import { useStyles } from "./styles";
import { FooterModel, lang } from "./constants";

export type PwaFooterProps = {};

export const PwaFooter = (props: PwaFooterProps) => {
  const { classes, theme } = useStyles() as any;

  const typographyElement = (text: string) => {
    return (
      <Typography variant={TypographyVariants.bodySmallLowEmphasis} colorValue={theme.tokens.semColors.neutral.text.lowEmphasis} component="span">
        {text}
      </Typography>
    );
  };

  return (
    <>
      {/* footer contianer */}
      <Grid container className={classes.newContainer}>
        {/* item for first 2 elements */}
        <Grid item>
          <Grid container className={classes.iconContainer}>
            {FooterModel.map(({ icon, text }, index) => (
              <Grid item key={index + icon} className={classes.iconTextContainer}>
                <MvSvgIcon name={icon} className={classes.footerIcon} />
                {typographyElement(text)}
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* item for copyright text */}
        <Grid item>{typographyElement(lang.COPY_RIGHT_TEXT)}</Grid>
      </Grid>
    </>
  );
};
