import React from "react";
import { Box } from "@mui/material";

import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import { IconNames } from "@mvloans/base-ui.mv-svg-icon";

import { Slider } from "./slider";
import { sliderVariants } from "./constants";

export const BasicSlider = ({ onChange }: { onChange?: () => void }) => {
  return (
    <ThemeProvider>
      <Box sx={{ width: 300, padding: "32px" }}>
        <Slider
          id={"Basic"}
          marks={[
            {
              value: 0,
              label: "Min ₹10,000",
            },
            {
              value: 100,
              label: "Max ₹90,000",
            },
          ]}
          onChange={onChange}
        />
      </Box>
    </ThemeProvider>
  );
};

export const GreenSlider = () => {
  return (
    <ThemeProvider>
      <Box sx={{ width: 300, padding: "32px" }}>
        <Slider
          id={"Basic"}
          variant={sliderVariants.GREEN}
          thumbIcon={IconNames.thumbCircleIcon}
          marks={[
            {
              value: 0,
              label: "Min ₹10,000",
            },
            {
              value: 100,
              label: "Max ₹90,000",
            },
          ]}
        />
      </Box>
    </ThemeProvider>
  );
};

export const FlipkartSlider = () => {
  return (
    <ThemeProvider>
      <Box sx={{ width: 300, padding: "32px" }}>
        <Slider
          id={"Basic"}
          thumbIcon={IconNames.thumbCircleIcon}
          marks={[
            {
              value: 0,
              label: "Min ₹10,000",
            },
            {
              value: 100,
              label: "Max ₹90,000",
            },
          ]}
        />
      </Box>
    </ThemeProvider>
  );
};
