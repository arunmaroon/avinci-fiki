import React, { ReactNode } from "react";
import Typography, { TypographyProps } from "@mvloans/base-ui.typography";
import { TypographyVariants, variantConstants } from "@mvloans/base-ui.common";
import { Checkbox, CheckboxIcons } from "@mvloans/base-ui.checkbox";
import { Grid } from "@mui/material";
import { CheckboxClasses } from "@mvloans/base-ui.checkbox";

import { useStyles } from "./styles";
import { LineDivider } from "@mvloans/base-ui.line-divider";

interface OptionObject {
  label?: string | ReactNode;
  disabled?: boolean;
  indeterminate?: boolean;
  icon?: ReactNode;
  checkedIcon?: ReactNode;
  value: string;

  labelProps?: TypographyProps;
  labelColor?: string;

  checkboxColor?: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
  size?: "small" | "medium";
  labelVariant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "pageTitle"
    | "sectionTitle"
    | "subTitle"
    | "paragraphSmall"
    | "paragraphDefault"
    | "paragraphLeading"
    | "buttonSmall"
    | "buttonDefault"
    | "buttonLarge"
    | "caption"
    | "overline"
    | any;

  checkboxStateIcons?: CheckboxIcons;
}
export type GroupCheckboxProps = {
  /**
   * Title for the container.
   */
  title: string;
  /**
   * Optional error for the container.
   */
  error?: string;
  /**
   * Render options that can be selected
   */
  options: Array<OptionObject>;
  /**
   * On Click handler to select the option
   */
  onChange: (e: any, value: string) => void;
  /**
   * Value to be passed for option selection
   */
  value: Array<string> | string;
  /**
   * Unique identifier
   */
  id: string;
  classes?: GroupCheckboxClasses;

  /**
   * showDivider on each option
   */
  showDivider?: boolean;
};

export interface GroupCheckboxClasses extends CheckboxClasses {
  container?: string;
  titleContainer?: string;
  groupCheckboxItem?: string;
}

export function GroupCheckbox({
  title,
  options = [],
  error,
  onChange,
  value = "",
  id,
  classes: propsClasses = {},
  showDivider = false,
}: GroupCheckboxProps) {
  const { classes, cx } = useStyles();
  return (
    <Grid container flexDirection={"column"} className={cx(classes.container, propsClasses.container)} gap={2} data-testid={id}>
      <Grid item className={cx(classes.titleContainer, propsClasses.titleContainer)}>
        <Grid container gap={0.5} flexDirection={"column"}>
          {title && (
            <Grid item>
              <Typography variant={TypographyVariants.bodyMediumLowEmphasis}>{title}</Typography>
            </Grid>
          )}
          {error && (
            <Grid item>
              <Typography variant={TypographyVariants.bodySmallLowEmphasis} className={classes.errorClass}>
                {error}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid item>
        <Grid container flexDirection="column" gap={1}>
          {options.map((item, i) => {
            const selected = value && Array.isArray(value) ? value.includes(item.value) : item.value === value;
            return (
              <>
                <Grid item key={i} className={cx(classes.groupCheckboxItem, propsClasses.groupCheckboxItem)}>
                  <Checkbox
                    label={item.label}
                    onChange={(e) => onChange && onChange(e, item.value)}
                    dataTestId={item.value}
                    classes={propsClasses}
                    indeterminate={item.indeterminate}
                    checked={selected}
                    disabled={item.disabled}
                    icon={item.icon}
                    checkedIcon={item.checkedIcon}
                    labelProps={item.labelProps}
                    labelColor={item.labelColor}
                    checkboxColor={item.checkboxColor}
                    size={item.size}
                    labelVariant={item.labelVariant}
                    checkboxStateIcons={item.checkboxStateIcons}
                  />
                </Grid>
                {/*i !== options.length - 1 is for hiding divider after last element */}
                {showDivider && i !== options.length - 1 && <LineDivider />}
              </>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
}
