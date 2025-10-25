import React from "react";
import { Box } from "@mui/material";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import { useState } from "react";
import { GroupCheckbox } from "./grouped-checkbox";

export const BasicGroupCheckbox = () => {
  const [selectedValue, setSelectedValue] = useState<Array<string>>([]);
  return (
    <ThemeProvider>
      <Box sx={{ width: 480 }}>
        <GroupCheckbox
          title="Choose communication preferences"
          value={selectedValue}
          options={[
            { label: "SMS", value: "SMS" },
            { label: "Email", value: "Email" },
            { label: "Whatsapp", value: "Whatsapp" },
          ]}
          id={"multiselect"}
          onChange={(e, value) => {
            let updatedValues = [...selectedValue];
            if (updatedValues.includes(value) && !e.target.checked) {
              updatedValues = updatedValues.filter((item) => item !== value);
            } else {
              updatedValues.push(value);
            }
            setSelectedValue(updatedValues);
          }}
        />
      </Box>
    </ThemeProvider>
  );
};

export const BasicGroupCheckboxWithError = () => {
  const [selectedValue, setSelectedValue] = useState<Array<string>>([]);
  return (
    <ThemeProvider>
      <Box sx={{ width: 480 }}>
        <GroupCheckbox
          title="Choose communication preferences"
          value={selectedValue}
          options={[
            { label: "SMS", value: "SMS" },
            { label: "Email", value: "Email" },
            { label: "Whatsapp", value: "Whatsapp" },
          ]}
          error="Select one preference"
          id={"multiselect"}
          onChange={(e, value) => {
            let updatedValues = [...selectedValue];
            if (updatedValues.includes(value) && !e.target.checked) {
              updatedValues = updatedValues.filter((item) => item !== value);
            } else {
              updatedValues.push(value);
            }
            setSelectedValue(updatedValues);
          }}
        />
      </Box>
    </ThemeProvider>
  );
};
