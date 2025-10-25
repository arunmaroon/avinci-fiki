import React from "react";
import { Accordion, AccordionDetails, AccordionSummary, SxProps, Theme, Typography } from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { ReactNode } from "react";

type AccordionCompProps = {
  title: ReactNode | string;
  children?: ReactNode | string;
  overrideStyle?: SxProps<Theme>;
  iconOverrideStyle?: SxProps<Theme>;
  expanded?: boolean;
  onChange?: (event: React.SyntheticEvent, isExpanded: boolean) => void;
};

const defaultStyles: SxProps<Theme> = {
  boxShadow: "none",
  "&:before": {
    display: "none",
  },
  "& .MuiAccordionSummary-root": {
    borderBottom: "1px solid transparent",
    padding: "0px",
    minHeight: "auto",
    "& .Mui-expanded": {
      minHeight: "auto",
    },
  },
  "& .MuiAccordionDetails-root": {
    padding: "0px",
    paddingBottom: "10px",
  },
  "&& .MuiAccordionSummary-content": {
    margin: "0px",
  },
};

const MvAccordion = (props: AccordionCompProps) => {
  const { title, children, overrideStyle, iconOverrideStyle, expanded, onChange } = props;
  return (
    <Accordion sx={{ ...defaultStyles, ...overrideStyle }} expanded={expanded} onChange={onChange}>
      <AccordionSummary expandIcon={<ExpandMoreRoundedIcon sx={{ ...iconOverrideStyle }} />} aria-controls="accordion-content">
        {title}
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
};

export default MvAccordion;
