import React, { ReactNode } from "react";
import { useStyles } from "./styles";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import MuiCheckbox from "@mui/material/Checkbox";
import Icon from "@mvloans/base-ui.icon";
import { checkboxIcons } from "./constants";
import Typography, { TypographyProps } from "@mvloans/base-ui.typography";
import { MvSvgIcon } from "@mvloans/base-ui.mv-svg-icon";

export type CheckboxProps = {
  /**
   * a node to be rendered in the special component.
   */
  children?: ReactNode;
  dataTestId: string;
  checked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  icon?: ReactNode;
  checkedIcon?: ReactNode;

  label?: string | ReactNode;
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
  onChange?: (e: any) => void;
  labelProps?: TypographyProps;
  labelColor?: string;
  checkboxStateIcons?: CheckboxIcons;
  classes?: CheckboxClasses;
};

export interface CheckboxIcons {
  default: string;
  disabled: string;
  checked: string;
  indeterminate: string;
}

export interface CheckboxClasses {
  formLabel?: string;
  checkBox?: string;
  label?: string;
  formGroup?: string;
}

export function Checkbox(props: CheckboxProps) {
  const {
    label,
    onChange,
    indeterminate,
    labelVariant,
    size,
    checkboxColor,
    disabled,
    dataTestId,
    checked,
    labelProps,
    labelColor,
    checkboxStateIcons = { ...checkboxIcons },
    classes: propsClasses = {},
  } = props;

  const { classes, cx, theme } = useStyles();

  const getIcon = (icon: string) => {
    return <MvSvgIcon name={icon} />;
  };

  return (
    <FormGroup className={cx(classes.formGroup, propsClasses.formGroup)}>
      <FormControlLabel
        className={cx(classes.formControlLabel, propsClasses.formLabel)}
        control={
          <MuiCheckbox
            disableRipple
            id={dataTestId}
            className={cx(propsClasses.checkBox, classes.checkbox)}
            size={size}
            color={checkboxColor}
            icon={getIcon(!disabled ? checkboxStateIcons.default : checkboxStateIcons.disabled)}
            checkedIcon={getIcon(checkboxStateIcons.checked)}
            onChange={onChange}
            disabled={disabled}
            data-testid={dataTestId}
            checked={checked}
            indeterminate={indeterminate}
            indeterminateIcon={getIcon(checkboxStateIcons.indeterminate)}
          />
        }
        label={
          <Typography className={cx(propsClasses.label)} variant={theme.tokens.checkboxListItem.text.typography} {...labelProps}>
            {label}
          </Typography>
        }
      />
    </FormGroup>
  );
}
