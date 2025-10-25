import { Box } from "@mui/material";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import React, { useState } from "react";
import { ChipContainer } from "./chip-container";

export const BasicChipContainerWithoutError = () => {
  const [selectedValue, setSelectedValue] = useState<Array<string>>([]);
  return (
    <ThemeProvider>
      <Box sx={{ width: 480 }}>
        <ChipContainer
          title="Gender"
          value={selectedValue}
          options={[
            { label: "Male", value: "Male" },
            { label: "Female", value: "Female" },
            { label: "Other", value: "Other" },
          ]}
          isMultiSelect={true}
          id={"multiselect"}
          onClick={(e, value) => {
            let updatedValues = [...selectedValue];
            if (updatedValues.includes(value)) {
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
export const BasicChipContainerWithError = () => {
  const [selectedValue, setSelectedValue] = useState("");
  return (
    <ThemeProvider>
      <Box sx={{ width: 480 }}>
        <ChipContainer
          title="Gender"
          options={[
            { label: "Male", value: "Male" },
            { label: "Female", value: "Female" },
            { label: "Other", value: "Other" },
          ]}
          value={selectedValue}
          error="Please choose one of the following options"
          onClick={(e, value) => {
            setSelectedValue(value);
          }}
          id={"singleSelect"}
        />
      </Box>
    </ThemeProvider>
  );
};
