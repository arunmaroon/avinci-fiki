import React, { ReactNode, useEffect, useState } from "react";
import { Accordion } from "@mvloans/base-ui.accordion";
import { useStyles } from "./styles";
import { Grid } from "@mui/material";
import Typography from "@mvloans/base-ui.typography";
import { IconNames } from "@mvloans/base-ui.common";

export type FaqProps = {
  /**
   * a node to be rendered in the special component.
   */
  children?: ReactNode;
  label?: string;
  description?: string;
  className?: string;
  id?: string;
  iconName?: IconNames;
  onExpansion?: (event: React.SyntheticEvent, isExpanded: boolean) => void;
  disabled?: boolean;
  expanded?: boolean;
  isFirstFaq?: boolean;
  isLastFaq?: boolean;
  classes?: {
    label?: string;
    description?: string;
  };
};

export function Faq({
  children,
  isLastFaq,
  label,
  isFirstFaq,
  className,
  id,
  disabled,
  expanded = false,
  onExpansion = () => {},
  iconName,
  description,
  classes: propsClasses = {},
}: FaqProps) {
  const { classes, cx, theme } = useStyles();
  const { textAccordian } = theme.tokens;
  const { descriptionText, icon, closed, open } = textAccordian;
  // todo[n]: icon is dependent on token changes in Accordion component

  const [expandedFaq, setExpandedFaq] = useState(false);

  useEffect(() => {
    setExpandedFaq(expanded);
  }, [expanded]);

  return (
    <Accordion
      disabled={disabled}
      id={id}
      iconName={iconName}
      onExpansion={(e, expand) => {
        setExpandedFaq(expand);
        onExpansion(e, expand);
      }}
      className={cx(classes.rootAccordianFaq, isFirstFaq && classes.firstFaq, isLastFaq && classes.lastFaq, className)}
      containerClassName={cx(classes.faqAccordion, isLastFaq && classes.lastFaqBorder)}
      label={label}
      expanded={expandedFaq}
      headingContainer={
        <Grid item className={cx(classes.headingFaq, propsClasses?.label)}>
          <Typography variant={expandedFaq ? open.titleText.typography : closed.titleText.typography}>{label}</Typography>
        </Grid>
      }>
      {description && (
        <Typography variant={descriptionText.typography} className={cx(classes.description, propsClasses?.description)}>
          {description}
        </Typography>
      )}
      {children}
    </Accordion>
  );
}
