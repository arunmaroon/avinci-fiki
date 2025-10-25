import React from "react";

import { Box } from "@mui/material";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import { Tag } from "./tag";
import {
  defaultTagDarkSubVariant,
  tagType,
  defaultTagVariant,
  tagRecommendedVariant,
  tagCreditScoreVariant,
  tagApplicationStatusVariant,
  tagTicketingStatusVariant,
} from "./constants";
import { IconNames } from "@mvloans/base-ui.common";

export const TagDefaultPrimaryGreen = () => (
  <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
    <ThemeProvider>
      <Tag
        type={tagType.DEFAULT}
        variant={defaultTagVariant.DARK}
        subVariant={defaultTagDarkSubVariant.PRIMARY}
        color="green"
        label="Default"
        onDelete={() => {}}
        suffixIcon={IconNames.accordionChevronIcon}
        suffixIconColor="white"
      />
    </ThemeProvider>
  </Box>
);

export const TagDefaultPrimaryYellow = () => (
  <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
    <ThemeProvider>
      <Tag
        type={tagType.DEFAULT}
        variant={defaultTagVariant.DARK}
        subVariant={defaultTagDarkSubVariant.PRIMARY}
        color="yellow"
        label="Default"
      />
    </ThemeProvider>
  </Box>
);

export const TagDefaultPrimaryOrange = () => (
  <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
    <ThemeProvider>
      <Tag
        type={tagType.DEFAULT}
        variant={defaultTagVariant.DARK}
        subVariant={defaultTagDarkSubVariant.PRIMARY}
        color="orange"
        label="Default"
      />
    </ThemeProvider>
  </Box>
);

export const TagDefaultPrimaryRed = () => (
  <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
    <ThemeProvider>
      <Tag
        type={tagType.DEFAULT}
        variant={defaultTagVariant.DARK}
        subVariant={defaultTagDarkSubVariant.PRIMARY}
        color="red"
        label="Default"
      />
    </ThemeProvider>
  </Box>
);

export const TagDefaultSecondaryGreen = () => (
  <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
    <ThemeProvider>
      <Tag
        type={tagType.DEFAULT}
        variant={defaultTagVariant.DARK}
        subVariant={defaultTagDarkSubVariant.SECONDARY}
        color="green"
        label="Default"
      />
    </ThemeProvider>
  </Box>
);

export const TagDefaultLightGrey = () => (
  <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
    <ThemeProvider>
      <Tag type={tagType.DEFAULT} variant={defaultTagVariant.LIGHT} color="grey" label="Default" />
    </ThemeProvider>
  </Box>
);

export const TagDefaultLightGreen = () => (
  <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
    <ThemeProvider>
      <Tag type={tagType.DEFAULT} variant={defaultTagVariant.LIGHT} color="green" label="Default" />
    </ThemeProvider>
  </Box>
);

export const TagDefaultLightBlue = () => (
  <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
    <ThemeProvider>
      <Tag type={tagType.DEFAULT} variant={defaultTagVariant.LIGHT} color="blue" label="Default" />
    </ThemeProvider>
  </Box>
);

export const TagDefaultLightYellow = () => (
  <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
    <ThemeProvider>
      <Tag type={tagType.DEFAULT} variant={defaultTagVariant.LIGHT} color="yellow" label="Default" />
    </ThemeProvider>
  </Box>
);

export const TagDefaultLightOrange = () => (
  <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
    <ThemeProvider>
      <Tag type={tagType.DEFAULT} variant={defaultTagVariant.LIGHT} color="orange" label="Default" />
    </ThemeProvider>
  </Box>
);

export const TagDefaultLightRed = () => (
  <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
    <ThemeProvider>
      <Tag type={tagType.DEFAULT} variant={defaultTagVariant.LIGHT} color="red" label="Default" />
    </ThemeProvider>
  </Box>
);

export const TagDefaultGradientGreen = () => (
  <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
    <ThemeProvider>
      <Tag type={tagType.DEFAULT} variant={defaultTagVariant.GRADIENT} color="green" label="Default" />
    </ThemeProvider>
  </Box>
);

export const TagDefaultGradientRed = () => (
  <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
    <ThemeProvider>
      <Tag type={tagType.DEFAULT} variant={defaultTagVariant.GRADIENT} color="red" label="Default" />
    </ThemeProvider>
  </Box>
);

export const TagRecommendedGreen = () => (
  <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
    <ThemeProvider>
      <Tag type={tagType.TAG_RECOMMENDED} variant={tagRecommendedVariant.GREEN} />
    </ThemeProvider>
  </Box>
);

export const TagCreditScore = () => (
  <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
    <ThemeProvider>
      <Tag type={tagType.TAG_CREDIT_SCORE} variant={tagCreditScoreVariant.EXCELLENT} />
    </ThemeProvider>
  </Box>
);

export const TagApplicationStatus = () => (
  <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
    <ThemeProvider>
      <Tag type={tagType.TAG_APPLICATION_STATUS} variant={tagApplicationStatusVariant.INCOMPLETE} />
    </ThemeProvider>
  </Box>
);

export const TagTicketingStatus = () => (
  <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
    <ThemeProvider>
      <Tag type={tagType.TAG_TICKETING_STATUS} variant={tagTicketingStatusVariant.RESOLVED} />
    </ThemeProvider>
  </Box>
);
