import { Box } from "@mui/material";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import React, { useState } from "react";
import { Autocomplete } from "./autocomplete";

export const SearchTextField = () => {
  const [value, setValue] = useState({});
  return (
    <ThemeProvider>
      <Box sx={{ width: 300 }}>
        <Autocomplete
          id="Basic"
          showSearchIcon={true}
          freeSolo
          onChange={(e: React.SyntheticEvent, value: any) => {
            setValue(value);
          }}
          helperText="Helper Text"
          value={value}
          options={[
            {
              label: "Yes Bank",
              icon: "https://s3.amazonaws.com/biller.moneywhiz.whizdm.com/Yes-qwk7mcH7-1413538889962.jpeg",
              value: "2c9f8ce54919308901491d7bc3e41342",
              groupLabel: "Popular banks",
            },
            {
              label: "ICICI Bank",
              icon: "https://s3.amazonaws.com/biller.moneywhiz.whizdm.com/ICICI-S8QwYqHH-1413538395681.jpeg",
              value: "2c9f8ce54919308901491d7439341334",
              groupLabel: "Popular banks",
            },
            {
              label: "HDFC Bank",
              icon: "https://s3.amazonaws.com/biller.moneywhiz.whizdm.com/HDFC-kc4ahGGE-1413538352542.gif",
              value: "2c9f8ce54919308901491d7391121332",
              groupLabel: "Other banks",
            },
          ]}
          label="Select Bank"
          placeholder="Select Bank Salary"
          defaultIcon="https://s3.amazonaws.com/biller.moneywhiz.whizdm.com/IndusInd-4g21pOW9-1413538929072.jpeg"
        />
      </Box>
    </ThemeProvider>
  );
};