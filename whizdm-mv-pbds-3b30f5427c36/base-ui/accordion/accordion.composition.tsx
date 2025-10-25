import { Box } from "@mui/material";
import TextField from "@mvloans/base-ui.text-field";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import React, { useState } from "react";
import { Accordion } from "./accordion";
import { AccordianStates, AccordionType } from "./constants";
import { IconNames } from "@mvloans/base-ui.common";

export const DefaultAccordion = () => {
  return (
    <ThemeProvider>
      <Box sx={{ width: 480 }}>
        <Accordion label={"Personal Details"} expanded={true} id="default">
          <TextField label="Father's Name" />
        </Accordion>
      </Box>
    </ThemeProvider>
  );
};

export const SavingAccordion = () => {
  const [expanded, setExpanded] = useState(true);
  return (
    <ThemeProvider>
      <Box sx={{ width: 480 }}>
        <Accordion
          label={"Personal Details"}
          state={AccordianStates.saving}
          expanded={expanded}
          onExpansion={(e, expand) => {
            setExpanded(expand);
          }}
          id="saving">
          <TextField label="Father's Name" />
        </Accordion>
      </Box>
    </ThemeProvider>
  );
};

export const SuccessAccordion = () => {
  return (
    <ThemeProvider>
      <Box sx={{ width: 480 }}>
        <Accordion label={"Personal Details"} state={AccordianStates.success} disabled={true} id="success">
          <TextField label="Father's Name" />
        </Accordion>
      </Box>
    </ThemeProvider>
  );
};

export const ErrorAccordion = () => {
  return (
    <ThemeProvider>
      <Box sx={{ width: 480 }}>
        <Accordion label={"Personal Details"} state={AccordianStates.error} id={"error"} expanded={true}>
          <TextField label="Father's Name" />
        </Accordion>
      </Box>
    </ThemeProvider>
  );
};

export const SecondaryAccordion = () => {
  const [expanded, setExpanded] = useState(false);
  return (
    <ThemeProvider>
      <Box sx={{ width: 480 }}>
        <Accordion
          label={"Verify via work email ID"}
          expanded={expanded}
          onExpansion={(e, expand) => {
            setExpanded(expand);
          }}
          iconName={IconNames.mailIcon}
          descriptionIcon={IconNames.clockIcon}
          description={"Takes less than 1min"}
          chipText="Recommended"
          type={AccordionType.secondary}
          subTitle={"An OTP would be sent to your work email ID"}
          id="secondary">
          <TextField label="Work Email Id" />
        </Accordion>
      </Box>
    </ThemeProvider>
  );
};

export const SecondaryAccordionDocuments = () => {
  const [expanded, setExpanded] = useState(false);
  return (
    <ThemeProvider>
      <Box sx={{ width: 480 }}>
        <Accordion
          label={"Verify via document upload"}
          expanded={expanded}
          onExpansion={(e, expand) => {
            setExpanded(expand);
          }}
          iconName={IconNames.documentIcon}
          descriptionIcon={IconNames.clockIcon}
          description={"Takes more than 24hrs"}
          type={AccordionType.secondary}
          subTitle={"Upload your work ID card / bank statement"}
          id="secondaryDocuments">
          <TextField label="Work Email Id" />
        </Accordion>
      </Box>
    </ThemeProvider>
  );
};

export const SecondaryAccordionOneByOne = () => {
  const [expanded, setExpanded] = useState(false);
  return (
    <ThemeProvider>
      <Box sx={{ width: 480 }}>
        <Accordion
          label={"Verify via document upload"}
          expanded={expanded}
          onExpansion={(e, expand) => {
            setExpanded(expand);
          }}
          iconName={IconNames.accordionPdfDocIcon}
          type={AccordionType.secondary}
          subTitle={"Upload separate PDFs for each month"}
          id="secondaryOneByOne">
          <TextField label="Work Email Id" />
        </Accordion>
      </Box>
    </ThemeProvider>
  );
};
