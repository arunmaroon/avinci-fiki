import React, { useState } from "react";
import { Box, Grid } from "@mui/material";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import { IconNames } from "@mvloans/base-ui.mv-svg-icon";
import Typography from "@mvloans/base-ui.typography";
import { buttonVariantConstants } from "@mvloans/base-ui.button";
import { TypographyVariants } from "@mvloans/base-ui.common";
import Autocomplete from "@mvloans/base-ui.autocomplete";
import TextField from "@mvloans/base-ui.text-field";
import Button from "@mvloans/base-ui.button";
import { RadioButton } from "./radio-button";

export const BasicRadioButtonInRow = () => {
  const [value, setValue] = useState("female");
  return (
    <ThemeProvider>
      <RadioButton
        dataTestId="basic-radio-button"
        options={[
          { value: "female", label: "Female" },
          { value: "male", label: "Male" },
        ]}
        value={value}
        radioGroupName="radio-group"
        onChange={(e, value) => setValue(value)}
        row
      />
    </ThemeProvider>
  );
};

export const BasicRadioButton = () => {
  const [value, setValue] = useState("female");
  return (
    <ThemeProvider>
      <RadioButton
        dataTestId="basic-radio-button"
        options={[
          { value: "female", label: "Female" },
          { value: "male", label: "Male" },
        ]}
        value={value}
        radioGroupName="radio-group"
        onChange={(e, value) => setValue(value)}
      />
    </ThemeProvider>
  );
};

export const RadioButtonWithPrefixIconWithError = () => {
  const [value, setValue] = useState("salaried");
  return (
    <Box sx={{ width: { xs: 312, md: 480 } }}>
      <ThemeProvider>
        <RadioButton
          dataTestId="radio-with-prefix-icon"
          title="Your employment type"
          error="Error message"
          options={[
            {
              value: "salaried",
              label: "Salaried",
              icon: IconNames.radioIdCard,
              selectedIcon: IconNames.radioIdCard,
            },
            {
              value: "self-employed",
              label: "Self-employed",
              icon: IconNames.radioSelfEmployed,
              selectedIcon: IconNames.radioSelfEmployed,
            },
          ]}
          value={value}
          onChange={(e, value) => setValue(value)}
        />
      </ThemeProvider>
    </Box>
  );
};

export const RadioButtonWithPrefixIconWithoutError = () => {
  const [value, setValue] = useState("salaried");
  return (
    <Box sx={{ width: { xs: 312, md: 480 } }}>
      <ThemeProvider>
        <RadioButton
          dataTestId="radio-with-prefix-icon"
          title="Your employment type"
          options={[
            {
              value: "salaried",
              label: "Salaried",
              icon: IconNames.radioIdCard,
              selectedIcon: IconNames.radioIdCard,
            },
            {
              value: "self-employed",
              label: "Self-employed",
              icon: IconNames.radioSelfEmployed,
              selectedIcon: IconNames.radioSelfEmployed,
            },
          ]}
          value={value}
          onChange={(e, value) => setValue(value)}
        />
      </ThemeProvider>
    </Box>
  );
};

export const RadioButtonWithChildren = () => {
  const [value, setValue] = useState("");
  return (
    <Box sx={{ width: { xs: 312, md: 480 } }}>
      <ThemeProvider>
        <RadioButton
          dataTestId="radio-with-children"
          title="Family Members Earning Status"
          options={[
            {
              value: "earning",
              label: "My family members are earning",
              children: (
                <div data-testid="member-form">
                  <Grid container spacing={2} direction="column">
                    <Grid item>
                      <Typography variant={TypographyVariants.bodyLargeMediumEmphasis} data-testid="member-title">
                        Member-1
                      </Typography>
                    </Grid>

                    <Grid item>
                      <Autocomplete
                        id="relation-input"
                        label="Relation"
                        options={[
                          { label: "Father", value: "father" },
                          { label: "Mother", value: "mother" },
                          { label: "Spouse", value: "spouse" },
                        ]}
                      />
                    </Grid>

                    <Grid item>
                      <Autocomplete
                        id="income-source-input"
                        label="Income source"
                        options={[
                          { label: "Salary", value: "salary" },
                          { label: "Business", value: "business" },
                          { label: "Self-employed", value: "self-employed" },
                        ]}
                      />
                    </Grid>

                    <Grid item>
                      <Button id="add-member-button" variant={buttonVariantConstants.SUPPORT_PRIMARY}>
                        + Add members
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              ),
            },
            {
              value: "not-earning",
              label: "My family members are not earning",
            },
          ]}
          value={value}
          onChange={(_, value) => setValue(value)}
        />
      </ThemeProvider>
    </Box>
  );
};

export const DisabledRadioButton = () => {
  const [value, setValue] = useState("female");
  return (
    <ThemeProvider>
      <RadioButton
        disabled
        dataTestId="basic-radio-button"
        options={[
          { value: "female", label: "Female" },
          { value: "male", label: "Male" },
        ]}
        value={value}
        radioGroupName="radio-group"
        onChange={(e, value) => setValue(value)}
      />
    </ThemeProvider>
  );
};
