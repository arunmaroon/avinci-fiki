import React, { ReactNode } from "react";
import { useStyles } from "./styles";
import { PWA_ICONS, TypographyVariants } from "@mvloans/base-ui.common";
import Typography from "@mvloans/base-ui.typography";
import Icon from "@mvloans/base-ui.icon";
import { Grid } from "@mui/material";
import { MvSvgIcon } from "@mvloans/base-ui.mv-svg-icon";
interface listItem {
  primaryText: string;
  secondaryText?: ReactNode | string;
  icon: string | JSX.Element;
  children?: ReactNode;
  rightIcon?: string;
}
export type ListProps = {
  /**
   *  options={[
          { primaryText: "Location", secondaryText: "To verify address details", icon: "ic-list-location" },
          {
            primaryText: "SMS",
            secondaryText: "To check eligibility and loan amount",
            icon: "ic-list-location",
            children: <img src={require("./LoanAgreement_nach-10.png")} height="100%" width="100%" />,
          },
          { primaryText: "Media and photos", secondaryText: "To update selfie", icon: "ic-list-location" },
        ]}
   */
  options: Array<listItem>;

  classes?: {
    listContainer?: string;
    gridContainer?: string;
    primaryText?: string;
    icon?: string;
    rightIcon?: string;
    listItemContainer?: string;
    childContainer?: string;
  };

  alignItems?: "flex-start" | "flex-end" | "center";
};

export function List({ options = [], classes: propsClasses = {}, alignItems = "flex-start" }: ListProps) {
  const { classes, cx, theme } = useStyles();
  const { spacing } = theme.tokens;

  return (
    <Grid container className={propsClasses?.listContainer}>
      {options &&
        options.map((option, index) => (
          <Grid key={index} container gap={spacing.xCompact} className={cx(classes.listItemContainer, propsClasses?.listItemContainer)}>
            <Grid container gap={spacing.default} className={cx(classes.listItem, propsClasses?.gridContainer)} alignItems={alignItems}>
              <Grid item className={cx(classes.icon, propsClasses.icon)}>
                {typeof option.icon === "string" ? <Icon iconName={option.icon} append={PWA_ICONS} height={24} width={24} /> : option.icon}
              </Grid>
              <Grid xs={8} item container className={cx(classes.text, propsClasses?.primaryText)} direction={"column"}>
                <Grid item>
                  <Typography
                    variant={TypographyVariants.bodyMediumHighEmphasis}
                    colorValue={theme.tokens.semColors.neutral.text.mediumEmphasis}>
                    {option.primaryText}
                  </Typography>
                </Grid>
                <Grid item>
                  {option.secondaryText && (
                    <Typography
                      variant={TypographyVariants.bodySmallLowEmphasis}
                      colorValue={theme.tokens.semColors.neutral.text.lowEmphasis}>
                      {option.secondaryText}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              {option.rightIcon && <MvSvgIcon name={option.rightIcon} className={cx(propsClasses.rightIcon)} />}
            </Grid>
            {option.children && <div className={cx(classes.childContainer, propsClasses.childContainer)}>{option.children}</div>}
          </Grid>
        ))}
    </Grid>
  );
}
