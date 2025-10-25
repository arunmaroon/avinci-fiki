import React from "react";
import MuiAutoComplete from "@mui/material/Autocomplete";
import TextField from "@mvloans/base-ui.text-field";
import { useStyles } from "./styles";
import { Box, Paper, Popper } from "@mui/material";
import Icon from "@mvloans/base-ui.icon";
import Typography from "@mvloans/base-ui.typography";
import { IconNames, MvSvgIcon } from "@mvloans/base-ui.mv-svg-icon";

export type AutocompleteProps = {
  /**
   * boolean for loader
   */
  isLoading?: boolean;
  /**
   * Array of options. Option having label, optional icon , optional value and optional groupLabel.
   */
  options?: Array<OptionTypes>;
  /**
   * Callback fired when the value changes.
   */
  onChange?: (e: React.SyntheticEvent, value: any) => void;
  /**
   * Callback fired when the text value changes.
   */
  onTextChange?: (e: any) => void;
  onKeyDown?: (e: any) => void;
  label?: string;
  id?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  freeSolo?: boolean;
  disableClearable?: boolean;
  value?: any;
  className?: string;
  textFieldClassName?: string;
  classes?: {
    textFieldPrefix?: string;
  };
  onBlur?: (e: any) => void;
  defaultIcon?: string;
  variant?: "filled" | "standard";
  showSearchIcon?: boolean;
};

interface OptionTypes {
  label: string;
  icon?: string;
  value?: string;
  groupLabel?: string;
}

export function Autocomplete({
  options = [],
  onChange,
  onTextChange,
  label,
  id,
  helperText,
  disabled,
  error,
  placeholder,
  freeSolo,
  disableClearable = true,
  value,
  textFieldClassName,
  classes: propClasses,
  className,
  onKeyDown,
  onBlur,
  defaultIcon,
  variant = "filled",
  showSearchIcon,
  isLoading
}: AutocompleteProps) {
  const { classes, cx, theme } = useStyles();

  const { iconSizing, dropdownListItem, dropdownList } = theme.tokens;

  const componentPrefix = showSearchIcon ? (
    <MvSvgIcon classes={classes.searchIcon} name={IconNames.searchIcon} height={iconSizing.medium} width={iconSizing.medium} />
  ) : (
    (value?.icon || defaultIcon) && <Icon src={value.icon || defaultIcon} height={iconSizing.medium} width={iconSizing.medium} />
  );

  return (
    <MuiAutoComplete
      id={id}
      className={cx(classes.root, className)}
      options={options}
      disabled={disabled}
      getOptionLabel={(option) => (option as OptionTypes).label || ""}
      groupBy={(option) => option.groupLabel || ""}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      isOptionEqualToValue={(option, value) => {
        let isValueEqual = false;
        if (value) {
          isValueEqual = option.value === value.value || option.label === value.label;
        }
        return isValueEqual;
      }}
      data-testid={id}
      value={value}
      renderGroup={(params) => {
        const { key, group, children } = params;
        return (
          <Box key={key}>
            <div className={classes.groupLabel}>
              <Typography variant={dropdownList.text.typography} colorValue={dropdownList.color}>
                {group}
              </Typography>
            </div>
            <div className={classes.groupOptions}>{children}</div>
          </Box>
        );
      }}
      renderOption={(props, option) => (
        <Box component="li" {...props} key={option.label} className={classes.options}>
          {option.icon ? <Icon src={option.icon} className={classes.iconClass} /> : null}
          <div className={classes.optionsLabel}>
            <Typography variant={dropdownListItem.unselected.titleText.typography} className={classes.option}>
              {option.label}
            </Typography>
          </div>
        </Box>
      )}
      PaperComponent={(props) => <Paper {...props} className={classes.rootPaper} />}
      PopperComponent={(props) => <Popper {...props} className={classes.popper} />}
      disableClearable={disableClearable}
      freeSolo={freeSolo}
      popupIcon={<MvSvgIcon name={IconNames.accordionChevronIcon} height={dropdownListItem.rightIcon.sizing} width={dropdownListItem.rightIcon.sizing} />}
      renderInput={(params) => (
        <TextField
          {...params}
          isLoading={isLoading}
          label={label}
          onChange={onTextChange}
          helperText={helperText}
          placeholder={placeholder}
          error={error}
          className={cx(classes.rootInput, textFieldClassName, (value?.icon || defaultIcon) && classes.rootInputWithPrefix)}
          prefix={componentPrefix}
          prefixClassName={cx(propClasses?.textFieldPrefix ? propClasses?.textFieldPrefix : "", classes.prefix)}
          variant={variant}
        />
      )}
    />
  );
}
