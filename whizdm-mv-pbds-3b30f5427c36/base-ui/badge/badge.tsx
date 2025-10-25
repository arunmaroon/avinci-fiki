import React from "react";
import MuiBadge from "@mui/material/Badge";
import { Typography } from "@mvloans/base-ui.typography";
import { useStyles } from "./styles";
import { MvSvgIcon } from "@mvloans/base-ui.mv-svg-icon";
import { Grid } from "@mui/material";
import { TypographyVariants } from "@mvloans/base-ui.common";

export type BadgeProps = {
  iconName?: string;
  badgeContent?: number;
  classes?: { contentClass: string; containerClass: string };
};

export function Badge(props: BadgeProps) {
  const { iconName, badgeContent, classes: propClasses } = props;
  const { theme, classes, cx } = useStyles({ iconName });
  const { badge } = theme.tokens;
  const hasContent = badgeContent !== undefined && badgeContent !== null;
  return (
    <Grid container className={classes.root}>
      <Grid
        container
        className={cx(
          iconName && hasContent ? classes.dotWithIconAndContent : "",
          iconName && !hasContent ? classes.dotWithIconWithoutContent : "",
          classes.dotRoot,
          hasContent ? classes.dotWithContent : classes.dotWithoutContent,
          !iconName && hasContent ? classes.dotWithoutIconAndWithContent : "",
          propClasses?.containerClass
        )}>
        {hasContent ? (
          <Typography className={propClasses?.contentClass} colorValue={badge.text.color} variant={TypographyVariants.bodyTinyLowEmphasis}>
            {badgeContent}
          </Typography>
        ) : (
          ""
        )}
      </Grid>
      {iconName && <MvSvgIcon className={classes.iconClass} name={iconName} />}
    </Grid>
  );
}
