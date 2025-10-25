import React, { useState } from "react";
import { useStyles } from "./styles";
import Grid from "@mui/material/Grid";
import TextField from "@mvloans/base-ui.text-field";
import Typography from "@mvloans/base-ui.typography";
import Timer from "./timer";

// keyCode constants
const BACKSPACE = 8;
const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;
const DELETE = 46;
const ENTER = 13;

export type OtpProps = {
  /**
   * Number of input boxes
   */
  numInputs?: number;

  /**
   * True if otp has error
   */
  hasError?: boolean;

  /**
   * True if otp boxes have to be shown in selected mode in error state
   */
  hasErrorSelected?: boolean;

  /**Function to pass otp value to parent and handle setValue in parent */
  onChange: (otp: string) => void;

  /**
   * Contains error text that needs to be shown in error mode
   */
  errorText?: string;
  helperText?: string;
  className?: string;
  value?: string;
  shouldAutoFocus?: boolean;
  id?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  /**
   * in seconds
   */
  timer?: number;
  variant?: "default" | "small";
};

export function Otp({
  numInputs = 4,
  hasError,
  hasErrorSelected,
  onChange,
  value = "",
  errorText,
  helperText,
  className,
  shouldAutoFocus = true,
  id = "otp",
  isDisabled = false,
  isLoading = false,
  timer,
  variant = "default",
}: OtpProps) {
  let [activeInput, setActiveInput] = useState(0);
  let otp = value || value === "" ? value.split("") : [];

  const inputs: any = [];
  const getOtp = (otpResult: string[]) => {
    onChange && onChange(otpResult.join(""));
  };
  const focusInput = (input: number) => {
    const activeInput = Math.max(Math.min(numInputs - 1, input), 0);
    setActiveInput(activeInput);
  };

  const changeCodeAtFocus = (value: string) => {
    let copyOtp = [...otp];
    copyOtp[activeInput] = value;
    onChange(copyOtp.join(""));
    getOtp(copyOtp);
  };

  const focusNextInput = () => {
    focusInput(activeInput + 1);
  };

  // Focus on previous input
  const focusPrevInput = () => {
    focusInput(activeInput - 1);
  };

  const getDataToChangeOTP = (value: string[]) => {
    // Paste data from focused input onwards
    let copyOtp = [...otp];
    for (let pos = 0; pos < numInputs; ++pos) {
      if (pos >= activeInput && value.length > 0) {
        copyOtp[pos] = value.shift() as string;
      }
    }
    getOtp(copyOtp);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ?? "";
    let updatedValue = value.slice(0, numInputs - activeInput).split("");

    getDataToChangeOTP(updatedValue);
    focusNextInput();
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.keyCode) {
      case BACKSPACE:
        e.preventDefault();
        changeCodeAtFocus("");
        focusPrevInput();
        break;
      case DELETE:
        e.preventDefault();
        changeCodeAtFocus("");
        break;
      case LEFT_ARROW:
        e.preventDefault();
        focusPrevInput();
        break;
      case RIGHT_ARROW:
        e.preventDefault();
        focusNextInput();
        break;
      case ENTER:
        otp.join("");
        break;
      default:
        break;
    }
  };

  const handleOnPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    // Get pastedData in an array of max size (num of inputs - current position)
    const pastedData = e.clipboardData
      .getData("text/plain")
      .slice(0, numInputs - activeInput)
      .split("");
    getDataToChangeOTP(pastedData);
  };

  const SingleInput = (props: any) => {
    const { classes, cx } = useStyles();
    return (
      <TextField
        autoFocus={props.autoFocus}
        className={cx(
          classes.inputClass,
          hasErrorSelected && classes.errorSelectedClass,
          hasError && classes.errorClass,
          (numInputs >= 6 || variant === "small") && classes.inputClassSmaller,
          hasError && (numInputs >= 6 || variant === "small") && classes.errorClassSmaller,
          numInputs == 4 && classes.inputClassForFour
        )}
        disabled={props.disabled}
        inputMode="tel"
        error={hasError}
        id={props.id}
        onChange={handleOnChange}
        onKeyDown={props.onKeyDown}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        onPaste={props.onPaste}
        key={props.key}
        value={props.value}
        isLoading={props.isLoading}
        otpLoader={true}
      />
    );
  };

  for (let i = 0; i < numInputs; i++) {
    if (!otp[i]) otp[i] = "";
    inputs.push(
      <Grid item key={i} flex={1}>
        <SingleInput
          autoFocus={shouldAutoFocus ? activeInput === i : false}
          onChange={handleOnChange}
          onKeyDown={handleOnKeyDown}
          onFocus={() => {
            setActiveInput(i);
          }}
          value={otp && otp[i]}
          onBlur={() => setActiveInput(-1)}
          onPaste={handleOnPaste}
          disabled={isDisabled}
          isLoading={isLoading}
        />
      </Grid>
    );
  }
  const { classes, cx, theme } = useStyles();
  const { codeInput } = theme.tokens;
  return (
    <>
      <Grid container className={cx(numInputs >= 6 ? classes.gridClassMore : classes.gridClass, className)} id={id} data-testid={id}>
        {inputs}
      </Grid>
      {errorText && (
        <Typography variant={codeInput.text.typography} colorValue={codeInput.error.helperText.color}>
          {errorText}
        </Typography>
      )}
      {(helperText || timer) && (
        <Grid container className={classes.bottomRoot}>
          {helperText && (
            <Grid item>
              <Typography variant={codeInput.text.typography}>{helperText}</Typography>
            </Grid>
          )}
          <Grid item>
            {timer && (
              <Typography variant={codeInput.text.typography}>
                <Timer timer={timer} />
              </Typography>
            )}
          </Grid>
        </Grid>
      )}
    </>
  );
}
