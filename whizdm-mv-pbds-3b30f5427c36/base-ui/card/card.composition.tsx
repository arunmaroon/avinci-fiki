import React from "react";
import { Box } from "@mui/material";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import { IconNames, projectTokens } from "@mvloans/base-ui.common";
import { Card } from "./card";
import { cardVariants } from "./constants";

export const Variant1WithFooterAndChildrenAndChip = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        marginTop: projectTokens.spacing[30],
      }}>
      <ThemeProvider>
        <Card
          id={"1"}
          variant={cardVariants.CARD_VARIANT_1}
          icon={IconNames.cardDefaultIcon}
          title="Card Title"
          subTitle="Card Description"
          text="Less than 1min"
          textIcon={IconNames.cardDefaultIcon}
          chipText="Recommended"
          dataTestId="variant1-footer-children-chip">
          children
        </Card>
      </ThemeProvider>
    </Box>
  );
};

export const Variant1WithFooterAndChip = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        marginTop: projectTokens.spacing[30],
      }}>
      <ThemeProvider>
        <Card
          id={"2"}
          variant={cardVariants.CARD_VARIANT_1}
          icon={IconNames.cardDefaultIcon}
          title="Card Title"
          subTitle="Card Description"
          text="Less than 1min"
          textIcon={IconNames.cardDefaultIcon}
          chipText="Recommended"
          dataTestId="variant1-footer-chip"
        />
      </ThemeProvider>
    </Box>
  );
};

export const Variant1WithChildrenAndChip = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        marginTop: projectTokens.spacing[30],
      }}>
      <ThemeProvider>
        <Card
          id={"1"}
          variant={cardVariants.CARD_VARIANT_1}
          icon={IconNames.cardDefaultIcon}
          title="Card Title"
          subTitle="Card Description"
          chipText="Recommended"
          dataTestId="variant1-children-chip">
          children
        </Card>
      </ThemeProvider>
    </Box>
  );
};

export const Variant1WithChip = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        marginTop: projectTokens.spacing[30],
      }}>
      <ThemeProvider>
        <Card
          id={"1"}
          variant={cardVariants.CARD_VARIANT_1}
          icon={IconNames.cardDefaultIcon}
          title="Card Title"
          subTitle="Card Description"
          chipText="Recommended"
          dataTestId="variant1-chip"
        />
      </ThemeProvider>
    </Box>
  );
};

export const Variant2WithFooterAndChildrenAndChip = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        marginTop: projectTokens.spacing[30],
      }}>
      <ThemeProvider>
        <Card
          id={"5"}
          variant={cardVariants.CARD_VARIANT_2}
          icon={IconNames.cardDefaultIcon}
          title="Card Title"
          subTitle="Card Description"
          text="Less than 1min"
          textIcon={IconNames.cardDefaultIcon}
          chipText="Recommended"
          dataTestId="variant2-footer-children-chip">
          children
        </Card>
      </ThemeProvider>
    </Box>
  );
};

export const Variant2WithFooterAndChip = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        marginTop: projectTokens.spacing[30],
      }}>
      <ThemeProvider>
        <Card
          id={"6"}
          variant={cardVariants.CARD_VARIANT_2}
          icon={IconNames.cardDefaultIcon}
          title="Card Title"
          subTitle="Card Description"
          text="Less than 1min"
          textIcon={IconNames.cardDefaultIcon}
          chipText="Recommended"
          dataTestId="variant2-footer-chip"
        />
      </ThemeProvider>
    </Box>
  );
};

export const Variant2WithChildrenAndChip = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        marginTop: projectTokens.spacing[30],
      }}>
      <ThemeProvider>
        <Card
          id={"7"}
          variant={cardVariants.CARD_VARIANT_2}
          icon={IconNames.cardDefaultIcon}
          title="Card Title"
          subTitle="Card Description"
          chipText="Recommended"
          dataTestId="variant2-children-chip">
          children
        </Card>
      </ThemeProvider>
    </Box>
  );
};

export const Variant2WithChip = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        marginTop: projectTokens.spacing[30],
      }}>
      <ThemeProvider>
        <Card
          id={"8"}
          variant={cardVariants.CARD_VARIANT_2}
          icon={IconNames.cardDefaultIcon}
          title="Card Title"
          subTitle="Card Description"
          chipText="Recommended"
          dataTestId="variant2-chip"
        />
      </ThemeProvider>
    </Box>
  );
};
