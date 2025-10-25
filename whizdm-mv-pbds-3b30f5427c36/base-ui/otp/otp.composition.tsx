import React, { useState } from "react";
import { Otp } from "./otp";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import { Box } from "@mui/material";

export const BasicOtp = () => {
  const [value, setValue] = useState<string>("1234");
  const onChange = (value: string) => {
    setValue(value);
  };
  return (
    <ThemeProvider>
      <Box width={312}>
        <Otp value={value} onChange={onChange} id={"basic"} />
      </Box>
    </ThemeProvider>
  );
};

export const OtpWithFiveInputs = () => {
  const [value, setValue] = useState("");
  const onChange = (value: string) => {
    setValue(value);
  };
  return (
    <ThemeProvider>
      <Box width={480}>
        <Otp numInputs={5} value={value} onChange={onChange} id={"otpWithFiveInputs"} />
      </Box>
    </ThemeProvider>
  );
};

export const OtpWithSixInputs = () => {
  const [value, setValue] = useState("");
  const onChange = (value: string) => {
    setValue(value);
  };
  return (
    <ThemeProvider>
      <Box width={480}>
        <Otp numInputs={6} value={value} onChange={onChange} id={"otpWithSixInputs"} />
      </Box>
    </ThemeProvider>
  );
};

export const OtpWithSixInputsWithError = () => {
  const [value, setValue] = useState("");
  const onChange = (value: string) => {
    setValue(value);
  };
  return (
    <ThemeProvider>
      <Box width={480}>
        <Otp
          numInputs={6}
          errorText="Please enter valid otp"
          hasError={true}
          value={value}
          onChange={onChange}
          id="otpWithSixInputsWithError"
        />
      </Box>
    </ThemeProvider>
  );
};

export const DisabledOtp = () => {
  const [value, setValue] = useState("");
  const onChange = (value: string) => {
    setValue(value);
  };
  return (
    <ThemeProvider>
      <Box width={480}>
        <Otp numInputs={6} value={value} onChange={onChange} id="otpWithSixInputsWithError" isDisabled={true} />
      </Box>
    </ThemeProvider>
  );
};

export const ShowTimer = () => {
  const [value, setValue] = useState("");
  const onChange = (value: string) => {
    setValue(value);
  };
  return (
    <ThemeProvider>
      <Box width={480}>
        <Otp timer={10} helperText="Helper Text" value={value} onChange={onChange} id="otpWithSixInputsWithError" />
      </Box>
    </ThemeProvider>
  );
};

export const OtpDisabledFilled = () => {
  const [value, setValue] = useState("13345");

  return (
    <ThemeProvider>
      <Box width={480}>
        <Otp
          numInputs={6}
          onChange={() => {
            setValue(value);
          }}
          value={value}
          id={"otpDisabled"}
          isDisabled
        />
      </Box>
    </ThemeProvider>
  );
};
