import React, { useState } from "react";
import { TextField } from "./text-field";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import Icon from "@mvloans/base-ui.icon";
import { Box } from "@mui/material";
import Typography from "@mvloans/base-ui.typography";
import { TypographyVariants } from "@mvloans/base-ui.common";

export const InteractivePromocode = () => {
  // added state management and function handlers for interactiveness
  const [value, setValue] = useState("");
  const [showSuffix, setShowSuffix] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleChange = (e: any) => {
    setValue(e.target.value);
    setShowSuffix(e.target.value.length > 0 ? true : false);
    setHasError(e.target.value.length > 0 ? false : true);
  };

  const handleSubmitClick = () => {
    setIsSuccess(true);
    setIsDisabled(true);
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <Box sx={{ width: { xs: 360, md: 312 } }}>
        <ThemeProvider>
          <TextField
            id="promocode"
            label="Promocode"
            placeholder=""
            disabled={isDisabled}
            error={hasError}
            success={isSuccess}
            helperText={
              (isSuccess && "Yay! You received ₹500 discount on the felicitation fee") || (hasError && "Please enter a valid promocode")
            }
            value={value}
            onChange={handleChange}
            showSuffix={showSuffix}
            prefix={
              <Icon
                iconName="ic-promocode-tag"
                iconExt="svg"
                style={{
                  width: 16 + "px",
                  height: 16 + "px",
                  marginBottom: 14 + "px",
                  verticalAlign: "middle",
                }}
              />
            }
            startAdornment={<Typography variant={TypographyVariants.bodyLargeLowEmphasis}>₹</Typography>}
            suffix={
              <Typography variant={TypographyVariants.bodySmallLowEmphasis} noUnderline={true} onClick={handleSubmitClick}>
                Submit
              </Typography>
            }
          />
        </ThemeProvider>
      </Box>
    </Box>
  );
};

export const InteractivePromocodeWithoutStartAdornment = () => {
  // added state management and function handlers for interactiveness
  const [value, setValue] = useState("");
  const [showSuffix, setShowSuffix] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleChange = (e: any) => {
    setValue(e.target.value);
    setShowSuffix(e.target.value.length > 0 ? true : false);
    setHasError(e.target.value.length > 0 ? false : true);
  };

  const handleSubmitClick = () => {
    setIsSuccess(true);
    setIsDisabled(true);
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <Box sx={{ width: { xs: 360, md: 312 } }}>
        <ThemeProvider>
          <TextField
            id="promocode"
            label="Promocode"
            placeholder=""
            disabled={isDisabled}
            error={hasError}
            success={isSuccess}
            helperText={
              (isSuccess && "Yay! You received ₹500 discount on the felicitation fee") || (hasError && "Please enter a valid promocode")
            }
            value={value}
            onChange={handleChange}
            showSuffix={showSuffix}
            prefix={
              <Icon
                iconName="ic-promocode-tag"
                iconExt="svg"
                style={{
                  width: 16 + "px",
                  height: 16 + "px",
                  marginBottom: 14 + "px",
                  verticalAlign: "middle",
                }}
              />
            }
            suffix={
              <Typography variant={TypographyVariants.bodySmallLowEmphasis} noUnderline={true} onClick={handleSubmitClick}>
                Submit
              </Typography>
            }
          />
        </ThemeProvider>
      </Box>
    </Box>
  );
};

export const InteractivePromocodeWithoutPrefix = () => {
  // added state management and function handlers for interactiveness
  const [value, setValue] = useState("");
  const [showSuffix, setShowSuffix] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleChange = (e: any) => {
    setValue(e.target.value);
    setShowSuffix(e.target.value.length > 0 ? true : false);
    setHasError(e.target.value.length > 0 ? false : true);
  };

  const handleSubmitClick = () => {
    setIsSuccess(true);
    setIsDisabled(true);
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <Box sx={{ width: { xs: 360, md: 312 } }}>
        <ThemeProvider>
          <TextField
            id="promocode"
            label="Promocode"
            placeholder=""
            disabled={isDisabled}
            error={hasError}
            success={isSuccess}
            helperText={
              (isSuccess && "Yay! You received ₹500 discount on the felicitation fee") || (hasError && "Please enter a valid promocode")
            }
            value={value}
            onChange={handleChange}
            showSuffix={showSuffix}
            startAdornment={<Typography variant={TypographyVariants.bodyLargeLowEmphasis}>₹</Typography>}
            suffix={
              <Typography variant={TypographyVariants.bodySmallLowEmphasis} noUnderline={true} onClick={handleSubmitClick}>
                Submit
              </Typography>
            }
          />
        </ThemeProvider>
      </Box>
    </Box>
  );
};

export const MultilineTextfield = () => {
  const [value, setValue] = useState("");
  const [showSuffix, setShowSuffix] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleChange = (e: any) => {
    setValue(e.target.value);
    setShowSuffix(e.target.value.length > 0 ? true : false);
    setHasError(e.target.value.length > 0 ? false : true);
  };

  const handleSubmitClick = () => {
    setIsSuccess(true);
    setIsDisabled(true);
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <Box sx={{ width: { xs: 360, md: 312 } }}>
        <ThemeProvider>
          <TextField
            id="unfilledWithPlaceholder"
            label="Label"
            placeholder="Placeholder"
            disabled={false}
            error={false}
            value={value}
            onChange={handleChange}
            helperText="Assistive Text"
            rows={4}
            maxRows={4}
          />
        </ThemeProvider>
      </Box>
    </Box>
  );
};

export const UnfilledWithPlaceholder = () => {
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <Box sx={{ width: { xs: 360, md: 312 } }}>
        <ThemeProvider>
          <TextField
            id="unfilledWithPlaceholder"
            label="Label"
            placeholder="Placeholder"
            disabled={false}
            error={false}
            helperText="Assistive Text"
            value=""
          />
        </ThemeProvider>
      </Box>
    </Box>
  );
};

export const Filled = () => {
  const [value, setValue] = useState("");
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <Box sx={{ width: { xs: 360, md: 312 } }}>
        <ThemeProvider>
          <TextField
            onChange={(e) => setValue(e.target.value)}
            id="filled"
            label="Label"
            placeholder="Placeholder"
            disabled={false}
            error={false}
            helperText="Assistive Text"
            value={value}
          />
        </ThemeProvider>
      </Box>
    </Box>
  );
};

export const UnfilledDisabled = () => {
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <Box sx={{ width: { xs: 360, md: 312 } }}>
        <ThemeProvider>
          <TextField
            id="unfilledDisabled"
            label="Label"
            placeholder=""
            disabled={true}
            error={false}
            helperText="Assistive Text"
            value=""
          />
        </ThemeProvider>
      </Box>
    </Box>
  );
};

export const FilledDisabled = () => {
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <Box sx={{ width: { xs: 360, md: 312 } }}>
        <ThemeProvider>
          <TextField
            id="filledDisabled"
            suffix={
              <Typography colorValue="#28292D" href="https://moneyview.in/" variant={TypographyVariants.bodySmallHighEmphasis}>
                Link
              </Typography>
            }
            label="Label"
            placeholder="Placeholder"
            disabled={true}
            error={false}
            helperText="Assistive Text"
            value="Input Value"
          />
        </ThemeProvider>
      </Box>
    </Box>
  );
};

export const UnfilledErrorWithPlaceholder = () => {
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <Box sx={{ width: { xs: 360, md: 312 } }}>
        <ThemeProvider>
          <TextField
            id="unfilledErrorWithPlaceholder"
            label="Label"
            placeholder="Placeholder"
            disabled={false}
            error={true}
            helperText="Error Text"
            value=""
          />
        </ThemeProvider>
      </Box>
    </Box>
  );
};

export const FilledError = () => {
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <Box sx={{ width: { xs: 360, md: 312 } }}>
        <ThemeProvider>
          <TextField
            id="filledError"
            label="Label"
            placeholder="Placeholder"
            disabled={false}
            helperText="Error Text"
            value="Input Value"
            maxRows={4}
            maxLength={30}
          />
        </ThemeProvider>
      </Box>
    </Box>
  );
};

export const UnfilledIconPrefix = () => {
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <Box sx={{ width: { xs: 360, md: 312 } }}>
        <ThemeProvider>
          <TextField
            id="unfilledIconPrefix"
            label="Label"
            disabled={false}
            error={false}
            helperText="Assistive Text"
            prefix={
              <Icon
                src="https://mv-in-site.s3.ap-south-1.amazonaws.com/cross_mark.png"
                style={{
                  width: 16 + "px",
                  height: 16 + "px",
                  marginBottom: 14 + "px",
                  verticalAlign: "middle",
                }}
              />
            }
          />
        </ThemeProvider>
      </Box>
    </Box>
  );
};

export const UnfilledIconPrefixTimer = () => {
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <Box sx={{ width: { xs: 360, md: 312 } }}>
        <ThemeProvider>
          <TextField
            id="unfilledIconPrefixTimer"
            label="Label"
            placeholder="Placeholder"
            disabled={false}
            error={false}
            helperText="Assistive Text"
            prefix={
              <Icon
                src="https://mv-in-site.s3.ap-south-1.amazonaws.com/cross_mark.png"
                style={{
                  width: 16 + "px",
                  height: 16 + "px",
                  marginBottom: 14 + "px",
                  verticalAlign: "middle",
                }}
              />
            }
            suffix={<Typography variant={TypographyVariants.bodySmallLowEmphasis}>0:30</Typography>}
          />
        </ThemeProvider>
      </Box>
    </Box>
  );
};

export const UnfilledIconPrefixLink = () => {
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <Box sx={{ width: { xs: 360, md: 312 } }}>
        <ThemeProvider>
          <TextField
            id="unfilledIconPrefixLink"
            label="Label"
            placeholder="Placeholder"
            disabled={false}
            error={false}
            helperText="Assistive Text"
            prefix={
              <Icon
                src="https://mv-in-site.s3.ap-south-1.amazonaws.com/cross_mark.png"
                style={{
                  width: 16 + "px",
                  height: 16 + "px",
                  marginBottom: 14 + "px",
                  verticalAlign: "middle",
                }}
              />
            }
            suffix={<Typography variant={TypographyVariants.bodySmallLowEmphasis}>Submit</Typography>}
          />
        </ThemeProvider>
      </Box>
    </Box>
  );
};

export const FilledIconPrefixLink = () => {
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <Box sx={{ width: { xs: 360, md: 312 } }}>
        <ThemeProvider>
          <TextField
            id="filledIconPrefixLink"
            label="Label"
            placeholder="Placeholder"
            disabled={false}
            error={false}
            helperText="Assistive Text"
            value="Input Value"
            prefix={
              <Icon
                src="https://mv-in-site.s3.ap-south-1.amazonaws.com/cross_mark.png"
                style={{
                  width: 16 + "px",
                  height: 16 + "px",
                  marginBottom: 14 + "px",
                  verticalAlign: "middle",
                }}
              />
            }
            suffix={<Typography variant={TypographyVariants.bodySmallLowEmphasis}>Submit</Typography>}
          />
        </ThemeProvider>
      </Box>
    </Box>
  );
};

export const FilledIconPrefixLinkSuccess = () => {
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <Box sx={{ width: { xs: 360, md: 312 } }}>
        <ThemeProvider>
          <TextField
            id="filledIconPrefixLinkSuccess"
            label="Label"
            placeholder="Placeholder"
            disabled={false}
            error={false}
            helperText="Assistive Text"
            value="Input Value"
            prefix={
              <Icon
                src="https://mv-in-site.s3.ap-south-1.amazonaws.com/cross_mark.png"
                style={{
                  width: 16 + "px",
                  height: 16 + "px",
                  marginBottom: 14 + "px",
                  verticalAlign: "middle",
                }}
              />
            }
            suffix={<Typography variant={TypographyVariants.bodySmallLowEmphasis}>Submit</Typography>}
            success={true}
          />
        </ThemeProvider>
      </Box>
    </Box>
  );
};

export const FilledIconPrefixLinkError = () => {
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <Box sx={{ width: { xs: 360, md: 312 } }}>
        <ThemeProvider>
          <TextField
            id="filledIconPrefixLinkError"
            label="Label"
            placeholder="Placeholder"
            disabled={false}
            error={true}
            helperText="Assistive Text"
            value="Input Value"
            prefix={
              <Icon
                src="https://mv-in-site.s3.ap-south-1.amazonaws.com/cross_mark.png"
                style={{
                  width: 16 + "px",
                  height: 16 + "px",
                  marginBottom: 14 + "px",
                  verticalAlign: "middle",
                }}
              />
            }
            suffix={<Typography variant={TypographyVariants.bodySmallLowEmphasis}>Submit</Typography>}
          />
        </ThemeProvider>
      </Box>
    </Box>
  );
};

export const SearchTextField = () => {
  const [value, setValue] = useState("");
  return (
    <ThemeProvider>
      <TextField
        value={value}
        onChange={(e) => setValue(e.target.value)}
        options={[
          {
            label: "POPULAR BANKS",
            subItems: [
              {
                label: "Yes Bank",
                icon: "https://s3.amazonaws.com/biller.moneywhiz.whizdm.com/Yes-qwk7mcH7-1413538889962.jpeg",
                value: "2c9f8ce54919308901491d7bc3e41342",
              },
              {
                label: "ICICI Bank",
                icon: "https://s3.amazonaws.com/biller.moneywhiz.whizdm.com/ICICI-S8QwYqHH-1413538395681.jpeg",
                value: "2c9f8ce54919308901491d7439341334",
              },
              {
                label: "HDFC Bank",
                icon: "https://s3.amazonaws.com/biller.moneywhiz.whizdm.com/HDFC-kc4ahGGE-1413538352542.gif",
                value: "2c9f8ce54919308901491d7391121332",
              },
            ],
          },
          {
            label: "OTHER BANKS",
            subItems: [
              {
                label: "Axis Bank",
                icon: "https://s3.amazonaws.com/biller.moneywhiz.whizdm.com/Yes-qwk7mcH7-1413538889962.jpeg",
                value: "2qc9f8ce54919308901491d7bc3e41342",
              },
              {
                label: "Andhra Bank",
                icon: "https://s3.amazonaws.com/biller.moneywhiz.whizdm.com/ICICI-S8QwYqHH-1413538395681.jpeg",
                value: "2qc9f8ce54919308901491d7439341334",
              },
              {
                label: "Canara Bank",
                icon: "https://s3.amazonaws.com/biller.moneywhiz.whizdm.com/HDFC-kc4ahGGE-1413538352542.gif",
                value: "2qc9f8ce54919308901491d7391121332",
              },
            ],
          },
        ]}
        label="Label"
        placeholder="Placeholder"
        helperText="Assistive Text"
        error={false}
        disabled={false}
      />
    </ThemeProvider>
  );
};

export const SelectTextField = () => {
  const [value, setValue] = useState([]);
  return (
    <Box sx={{ width: { xs: 360, md: 312 } }}>
      <ThemeProvider>
        <TextField
          value={value}
          onChange={(e) => setValue(e.target.value)}
          options={[
            { label: "Option with a large text to verify if the spacing works or not", value: "value" },
            { label: "Option2", value: "value2" },
            { label: "Option3", value: "value3" },
          ]}
          label="Label"
          placeholder="Placeholder"
          helperText="Assistive Text"
          error={false}
          disabled={false}
          selectProps={{
            multiple: true,
            renderValue: (selected: any) => {
              const renderSelectedValues = (selected: string[], options: any[]): string => {
                return options
                  ?.filter((option) => selected.includes(option.value))
                  .map((option) => option.label)
                  .join(", ");
              };
              return renderSelectedValues(selected, [
                { label: "Option with a large text to verify if the spacing works or not", value: "value" },
                { label: "Option2", value: "value2" },
                { label: "Option3", value: "value3" },
              ]);
            },
          }}
        />
      </ThemeProvider>
    </Box>
  );
};

export const AadharTextField = () => {
  return (
    <Box sx={{ width: { xs: 360, md: 312 } }}>
      <ThemeProvider>
        <TextField
          label="Aadhaar"
          maskType="aadhaar"
          helperText="Enter first 8 digits of aadhaar"
          error={false}
          disabled={false}
          last4digits={"1234"}
          shrinkLabel={true}
        />
      </ThemeProvider>
    </Box>
  );
};

export const DateTextField = () => {
  return (
    <Box sx={{ width: { xs: 360, md: 312 } }}>
      <ThemeProvider>
        <TextField
          maskType="date"
          label="Label Value"
          placeholder="DD/MM/YYYY"
          helperText="Assistive Text"
          error={false}
          disabled={false}
        />
      </ThemeProvider>
    </Box>
  );
};
