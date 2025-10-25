import React, { ReactNode } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { Grid } from "@mui/material";

import Typography from "@mvloans/base-ui.typography";
import { MvSvgIcon } from "@mvloans/base-ui.mv-svg-icon";

import { radioIcons } from "./constants";
import { useStyles } from "./styles";

export type RadioButtonProps = {
  /**
   * To grab element for testing
   */
  dataTestId?: string;
  radioGroupName?: string;

  options?: Array<any>;

  /**
   * To show radio buttons in disabled mode
   */
  disabled?: boolean;
  /**Pass custom class here */
  className?: string;

  /**Use this to pass default selected value as well */
  value?: string;

  onChange?: (event: React.BaseSyntheticEvent, value: string) => void;
  title?: string;
  error?: string;
  /**Pass this is as true if options needs to be rendered in a row */
  row?: boolean;
  stateIcons?: StateIcons;
  classes?: {
    formControl?: string;
    radioGroup?: string;
    formControlLabel?: string;
    radio?: string;
  };
};

export interface StateIcons {
  default: string;
  disabled: string;
  selected: string;
}

export function RadioButton(props: RadioButtonProps) {
  const {
    radioGroupName,
    options,
    dataTestId,
    disabled,
    title,
    error,
    classes: propsClasses = {},
    value,
    row = false,
    stateIcons = { ...radioIcons },
  } = props;

  const { classes, cx, theme } = useStyles({ row });

  const getIcon = (isCheckedIcon = false) => {
    let iconName = disabled ? stateIcons.disabled : stateIcons.default;

    if (isCheckedIcon) {
      iconName = stateIcons.selected;
    }
    return <MvSvgIcon name={iconName} className={classes.iconClass} />;
  };

  const handleChange = (event: React.BaseSyntheticEvent) => {
    props.onChange && props.onChange(event, event.target.value);
  };

  const handleClick = (event: any, option: any) => {
    props.onChange && props.onChange(event, option.value);
  };

  return (
    <FormControl className={cx(classes.formControlClass, propsClasses.formControl)}>
      <RadioGroup
        row={row}
        name={radioGroupName}
        value={value}
        onChange={handleChange}
        data-testid={dataTestId}
        className={propsClasses.radioGroup}>
        {title && (
          <Typography className={classes.titleClass} variant={theme.tokens.radioList.title.text.typography}>
            {title}
          </Typography>
        )}

        {error && (
          <Typography variant={theme.tokens.radioList.error.text.typography} className={classes.errorClass}>
            {error}
          </Typography>
        )}

        {/* For Radio Button with no icons on the left */}
        {options &&
          !options[0].icon &&
          options.map((option) => (
            <React.Fragment key={option.value}>
              <FormControlLabel
                value={option.value}
                label={option.label}
                disabled={disabled}
                className={cx(classes.labelClass, propsClasses.formControlLabel)}
                control={
                  <Radio
                    className={cx(classes.radioClass, propsClasses.radio)}
                    disableRipple
                    checkedIcon={getIcon(true)}
                    icon={getIcon()}
                    disabled={option.disabled}
                  />
                }
              />
              {value === option.value && option.children && (
                <Grid container className={classes.childrenContainer}>
                  <Grid item xs={12}>
                    {option.children}
                  </Grid>
                </Grid>
              )}
            </React.Fragment>
          ))}

        {/* For Radio Button with icons on the left */}
        {options &&
          options[0].icon &&
          options.map((option) => (
            <React.Fragment key={option.value}>
              <Grid
                container
                direction="row"
                alignItems="center"
                alignContent="center"
                onClick={(e) => handleClick(e, option)}
                className={classes.gridContainer}>
                <Grid item className={classes.gridItemClass}>
                  <div
                    className={value != option.value ? cx(classes.labelIconClass, classes.nonSelectedIconClass) : classes.labelIconClass}>
                    <>
                      <MvSvgIcon
                        className={value == option.value ? classes.selectedWithPrefixIconClass : classes.nonSelectedWithPrefixIconClass}
                        width={theme.tokens.sizing.xSmall}
                        height={theme.tokens.sizing.xSmall}
                        name={value == option.value ? option.icon ?? "" : option.selectedIcon ?? ""}
                      />
                    </>
                  </div>
                </Grid>
                <Grid item className={classes.prefixLabelClass}>
                  <Typography
                    variant={
                      value == option.value
                        ? theme.tokens.radioListItem.selected.text.typography
                        : theme.tokens.radioListItem.unselected.text.typography
                    }
                    dataAttr={option.label}>
                    {option.label}
                  </Typography>
                </Grid>
                <Grid item className={classes.radioIconClass}>
                  <FormControlLabel
                    className={cx(classes.formControlClass, propsClasses.formControlLabel)}
                    value={option.value}
                    label=""
                    disabled={disabled}
                    control={
                      <Radio
                        disableRipple
                        disabled={option.disabled}
                        checkedIcon={getIcon(true)}
                        icon={getIcon()}
                        className={cx(classes.radioClass, classes.radioIconLeftPadding, propsClasses.radio)}
                      />
                    }
                  />
                </Grid>
              </Grid>
              {value === option.value && option.children && (
                <Grid container className={classes.childrenContainer}>
                  <Grid item xs={12}>
                    {option.children}
                  </Grid>
                </Grid>
              )}
            </React.Fragment>
          ))}
      </RadioGroup>
    </FormControl>
  );
}
