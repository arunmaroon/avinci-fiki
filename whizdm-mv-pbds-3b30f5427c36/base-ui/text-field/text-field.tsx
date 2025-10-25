import { FilledInputProps, Grid, InputBaseComponentProps, InputProps, ListSubheader, OutlinedInputProps, SelectProps } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import MuiTextField from "@mui/material/TextField";
import { TypographyVariants } from "@mvloans/base-ui.common";
import Icon from "@mvloans/base-ui.icon";
import Typography from "@mvloans/base-ui.typography";
import React, { useEffect, useRef, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import { labels } from "./constants";
import { useStyles } from "./styles";
import TextMask from "./text-mask";

export type TextFieldProps = {
  /**
   * boolean for loader
   */
  isLoading?: boolean;
  /**
   * boolean for lower loader
   */
  otpLoader?: boolean;
  /**
   * label for textField
   */
  label?: string;
  /**
   * unique identifier
   */
  id?: string;
  /**
   * Class for overriding styles
   */
  className?: string;
  /**
   * Value for the input field
   */
  value?: string | string[];
  /**
   * React ref for textField
   */
  inputRef?: React.Ref<any>;
  /**
   * on change event handler
   */
  onChange?: (e: any) => void;
  /**
   * on blur event handler
   */
  onBlur?: (e: any) => void;
  /**
   * on paste event handler
   */
  onPaste?: (e: any) => void;
  /**
   * on KeyDown event handler
   */
  onKeyDown?: (e: any) => void;
  /**
   * on Key Press event handler
   */
  onKeyPress?: (e: any) => void;
  /**
   * on focus event handler
   */
  onFocus?: (e: any) => void;
  /**
   * placeholder to be displayed for input field
   */
  placeholder?: string;
  /**
   * error to be displayed for input field
   */
  error?: boolean;
  /**
   * is textField success
   */
  success?: boolean;
  /**
   * is textField focused
   */
  focused?: boolean;
  /**
   * Helper text for text field
   */
  helperText?: React.ReactNode | string;
  /**
   * Render textField in disabled state
   */
  disabled?: boolean;
  /**
   * Type of the input field
   */
  type?: string;
  /**
   * React node to render on prefix, Currently Mui icons and text prefix are working as expected
   */
  prefix?: React.ReactNode;
  /**
   * React node to render on prefix, Currently Mui icons and text prefix are working as expected
   */
  startAdornment?: React.ReactNode | string;
  /**
   * React node to render on suffix, Currently Mui icons, text, and button prefix are working as expected
   * Bg color gets override to primary.main for default state and grey2.light for disable state
   */
  // todo[n]: doubt with this: text color gets set to primary.main (how to change it to design token color)
  suffix?: React.ReactNode;
  // flag to display suffix
  showSuffix?: boolean;

  /**
   * Enable multiline, Set max number of rows on text field
   */
  maxRows?: number;
  /**
   * Enable multiline, Set max number of rows on text field
   */
  rows?: number;
  /**
   * options to select from textField
   */
  options?: Array<OptionTypes>;
  /**
   * unique key for react to render
   */
  key?: number | string;
  /**
   * inputMode for textField
   */
  inputMode?: "text" | "none" | "search" | "tel" | "url" | "email" | "numeric" | "decimal";

  /**
   * Enable input text masking, Date : DD/MM/YYYY
   */
  maskType?: "date" | "aadhaar";
  name?: string;
  last4digits?: string;

  /**
   * Set max number of characters allowed
   */
  maxLength?: number;
  listHeaderClassName?: string;
  autoFocus?: boolean;
  selectLabel?: string;

  /**
   * Props applied to the Input element.
   */
  InputProps?: Partial<FilledInputProps> | Partial<InputProps> | Partial<OutlinedInputProps> | undefined;
  /**
   * Attributes applied to the `input` element.
   */
  inputProps?: InputBaseComponentProps;
  /**
   * class to override styles for prefix
   */

  selectProps?: SelectProps & { hideOptions?: boolean };
  prefixClassName?: string;
  /**
   * onClick listener to handle suffix click listener
   */
  handleSuffixClick?: (e: any) => void;

  variant?: "filled" | "standard";

  /**
   * Shrink the placeholder text
   */
  shrinkLabel?: boolean;
  propClasses?: {
    listClass?: string;
    paperClass?: string;
  };
};

interface OptionTypes {
  label: string;
  icon?: string;
  value?: string;
  disabled?: boolean;
  subItems?: Array<{
    label: string;
    icon?: string;
    value?: string;
    disabled?: boolean;
  }>;
}

const renderOptions = (subItem: OptionTypes, classes: any, theme: any) => {
  const { dropdownListItem } = theme.tokens;
  return (
    <MenuItem disabled={subItem.disabled} key={subItem.label} value={subItem.value || subItem.label} className={classes.options}>
      <div key={subItem.label}>
        {subItem.icon ? <Icon src={subItem.icon} className={classes.iconClass} /> : null}
        <div className={classes.optionsLabel}>
          <Typography
            variant={TypographyVariants.bodyLargeLowEmphasis}
            className={classes.option}
            colorValue={dropdownListItem.titleText.color}>
            {subItem.label}
          </Typography>
        </div>
      </div>
    </MenuItem>
  );
};

const IconComponent = (props: any) => <Icon iconName={"ic-accordion-chevron"} height={24} width={24} {...props} />;

export function TextField(props: TextFieldProps) {
  const {
    focused,
    value = "",
    onChange = () => {},
    onBlur,
    onKeyDown,
    onKeyPress,
    onPaste,
    label,
    helperText,
    id,
    disabled,
    error,
    placeholder,
    startAdornment,
    prefix,
    suffix,
    showSuffix,
    maxRows,
    inputRef,
    className,
    type,
    options,
    key,
    maskType,
    inputMode,
    name,
    success,
    maxLength,
    listHeaderClassName,
    autoFocus = false,
    selectLabel,
    prefixClassName,
    InputProps = {},
    inputProps = {},
    onFocus,
    last4digits,
    /** Handle other variant styles on PWA */
    variant = "filled",
    isLoading,
    otpLoader = false,
    shrinkLabel,
    rows,
    selectProps = {},
    propClasses = {},
  } = props;

  const { classes, cx, theme } = useStyles({ selectProps });
  const { textInput, typography, semColors } = theme.tokens;
  const { helperText: helperTextToken } = textInput;

  const ref = useRef<HTMLDivElement>(null);
  const [selectWidth, setSelectWidth] = useState<string | number>("auto");

  const getValue = () => {
    return maxLength && value.length > 0 ? value.slice(0, maxLength) : value;
  };

  const inputPropsType: { [key: string]: any } = {
    disableUnderline: true,
    endAdornment: showSuffix && suffix && (
      <InputAdornment className="themeInputAdornment" position="end">
        {suffix}
      </InputAdornment>
    ),
    startAdornment: startAdornment && <InputAdornment position="start">{startAdornment}</InputAdornment>,
    ...InputProps,
  };

  const inputElementProps: { [key: string]: any } = {
    inputMode: inputMode,
    autoComplete: "off",
    ...inputProps,
  };

  if (maskType) {
    /**
     * Pass this to mask component and based on this component fill mask,
     * We can't define this on object definitions because it will give warning for non masked input
     */
    inputElementProps.maskType = maskType;
    if (last4digits) inputElementProps.last4digits = last4digits;
    inputPropsType.inputComponent = TextMask;
  }

  useEffect(() => {
    if (ref?.current?.clientWidth) {
      setSelectWidth(ref.current.clientWidth);
    }
  }, []);

  return isLoading ? (
    <Grid container className={classes.skeletonContainer}>
      <Skeleton className={cx(classes.skeletonRoot, otpLoader ? classes.skeletonRootOtp : "")} variant="rectangular" />
      {!otpLoader && <Skeleton className={classes.skeletonChild} variant="rectangular" />}
    </Grid>
  ) : (
    <Grid container className={classes.containerClass}>
      <Grid item className={cx(classes.prefixClass, prefixClassName)} alignItems="center" justifyContent={"center"}>
        {prefix}
      </Grid>
      <Grid item className={classes.textfieldGrid}>
        <MuiTextField
          key={key}
          focused={focused}
          variant={variant}
          value={getValue()}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          onKeyPress={onKeyPress}
          onPaste={onPaste}
          onFocus={onFocus}
          label={label}
          InputLabelProps={{
            shrink: shrinkLabel,
          }}
          ref={ref}
          helperText={
            helperText || maxLength ? (
              <Typography
                variant={helperTextToken.typography}
                className={cx(classes.helperTextClass, maxRows && maxLength && classes.multilineHelperTextClass)}>
                <span>{helperText}</span>
                {maxRows && maxLength && (
                  <span>
                    {value?.length}/{maxLength}
                  </span>
                )}
              </Typography>
            ) : null
          }
          id={id}
          disabled={disabled}
          error={error}
          placeholder={placeholder}
          multiline={!!maxRows}
          maxRows={maxRows}
          rows={rows}
          inputRef={inputRef}
          className={cx(
            classes.root,
            prefix && classes.withPrefix,
            !prefix && startAdornment && classes.withstartAdornment,
            startAdornment && prefix && classes.withPrefixAndAdornment,
            !!maxRows && classes.multilineRoot,
            !error && success && classes.success,
            className
          )}
          type={type}
          InputProps={inputPropsType}
          inputProps={inputElementProps}
          select={!!(options && options.length)}
          SelectProps={{
            IconComponent,
            MenuProps: {
              classes: {
                paper: cx(classes.paper, propClasses.paperClass),
                list: cx(classes.list, propClasses.listClass),
              },
              PaperProps: { sx: { width: selectWidth } },
            },
            ...selectProps,
          }}
          name={name}
          autoFocus={autoFocus}>
          {selectLabel && (
            <ListSubheader key={labels.SELECT}>
              <Typography variant={TypographyVariants.bodyTinyHighEmphasis}>{selectLabel}</Typography>
            </ListSubheader>
          )}
          {options &&
            options.map((option) => {
              return option.subItems
                ? [
                    <ListSubheader key={option.label} className={cx(classes.listHeaderClass, listHeaderClassName)}>
                      <Typography colorValue={semColors.neutral.text.highEmphasis} variant={TypographyVariants.bodyLargeLowEmphasis}>
                        {option.label}
                      </Typography>
                    </ListSubheader>,
                    option.subItems.map((subItem) => renderOptions(subItem, classes, theme)),
                  ]
                : renderOptions(option, classes, theme);
            })}
        </MuiTextField>
      </Grid>
    </Grid>
  );
}
