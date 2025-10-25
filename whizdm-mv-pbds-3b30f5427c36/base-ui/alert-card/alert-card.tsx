import React, { ReactNode } from "react";
import { DialogActions, DialogContent, Grid, Dialog as MuiDialog } from "@mui/material";
import { PWA_ICONS, TypographyVariants, variantConstants } from "@mvloans/base-ui.common";
import Typography from "@mvloans/base-ui.typography";
import { IconNames, MvSvgIcon } from "@mvloans/base-ui.mv-svg-icon";
import Button from "@mvloans/base-ui.button";
import Icon from "@mvloans/base-ui.icon";
import { useStyles } from "./styles";

export type AlertCardProps = {
  title: string;
  iconName?: string;
  open: boolean;
  description: string;
  children?: ReactNode;
  buttonConfig: Array<any>;
  onClose: (val: boolean) => void;
};

export function AlertCard(props: AlertCardProps) {
  const { title, description, buttonConfig, open, onClose, iconName, children } = props;
  const { classes, theme } = useStyles({ iconName });
  const { spacing, semColors } = theme.tokens;

  return (
    <MuiDialog className={classes.dialogContainer} open={open}>
      <DialogContent>
        {iconName && (
          <>
            <Grid className={classes.image} container justifyContent={"center"} alignItems={"center"}>
              <Icon iconName={iconName} append={PWA_ICONS} />
            </Grid>
            <Grid item className={classes.closeIcon}>
              <MvSvgIcon
                onClick={() => onClose && onClose(false)}
                width={theme.tokens.sizing.small}
                height={theme.tokens.sizing.small}
                name={IconNames.closeIcon}
              />
            </Grid>
          </>
        )}
        <Grid container gap={spacing.default} justifyContent={"space-between"}>
          <Grid item>
            <Grid container direction={"column"} gap={spacing["2xCompact"]}>
              <Grid item className={classes.title}>
                <Typography variant={TypographyVariants.title2} colorValue={semColors.neutral.text.highEmphasis}>
                  {title}
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant={TypographyVariants.bodySmallLowEmphasis}
                  colorValue={semColors.neutral.text.lowEmphasis}
                  className={classes.description}>
                  {description}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {!iconName && (
            <Grid item className={classes.closeIconInWithoutImageVariant}>
              <MvSvgIcon
                onClick={() => onClose && onClose(false)}
                width={theme.tokens.sizing.small}
                height={theme.tokens.sizing.small}
                name={IconNames.closeIcon}
              />
            </Grid>
          )}
        </Grid>
        {children && (
          <Grid container className={classes.textField}>
            {children}
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        {Array.isArray(buttonConfig) && buttonConfig.length > 0 && (
          <Grid container direction={"column"} gap={spacing.default}>
            {buttonConfig.map((ele, i) => (
              <Grid className={classes.actionBtn} item key={i}>
                <Button
                  size={ele.size || variantConstants.BUTTONSMALL}
                  onClick={ele.onClick}
                  variant={ele.variant}
                  id={ele.id}
                  className={ele.className}
                  withIcon>
                  {ele.btnText}
                </Button>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogActions>
    </MuiDialog>
  );
}
