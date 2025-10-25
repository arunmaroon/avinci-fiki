import React, { ReactNode } from "react";
import MuiAccordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { useStyles } from "./styles";
import Typography from "@mvloans/base-ui.typography";
import { AccordianStates, AccordionType } from "./constants";
import { Box, Chip, CircularProgress, Grid } from "@mui/material";
import Boundary from "@mvloans/base-ui.boundary";
import { IconNames, projectTokens, TypographyVariants } from "@mvloans/base-ui.common";
import { MvSvgIcon } from "@mvloans/base-ui.mv-svg-icon";
import { pothosTokens } from "@mvloans/base-ui.tokens";
import Icon from "@mvloans/base-ui.icon";

const { sizing } = pothosTokens;

const ExpandIcon = () => <MvSvgIcon name={IconNames.accordionChevronIcon} height={sizing.small} width={sizing.small} />;

export type AccordionProps = {
  /**
   * a node to be rendered in the special component.
   */
  children?: ReactNode;

  state?: AccordianStates;
  label?: string;
  className?: string;
  id?: string;
  iconName?: IconNames;
  onExpansion?: (event: React.SyntheticEvent, isExpanded: boolean) => void;
  disabled?: boolean;
  expanded?: boolean;
  containerClassName?: string;
  headingContainer?: React.ReactNode;
  /**
   * Accordion type for handling different states
   */
  type?: AccordionType;
  /**
   * Subtitle for Accordion
   */
  subTitle?: string;
  descriptionIcon?: IconNames;
  description?: string;
  chipText?: string;
  iconSrc?: string;
};

export function Accordion({
  children,
  state = AccordianStates.default,
  label,
  className,
  id,
  iconName = IconNames.accordionDefaultUserIcon,
  iconSrc,
  onExpansion = () => {},
  disabled = false,
  expanded = false,
  containerClassName,
  headingContainer,
  type = AccordionType.primary,
  subTitle,
  descriptionIcon,
  description,
  chipText,
}: AccordionProps) {
  const { classes, cx, theme } = useStyles({ state, iconName });
  const { iconSizing, semColors } = theme.tokens;
  const handleChange = () => (event: React.SyntheticEvent, isExpanded: boolean) => {
    onExpansion(event, isExpanded);
  };

  const iconVariant = {
    error: IconNames.accordionAlertIcon,
    success: IconNames.accordionSuccessCircledTickIcon,
  };

  const getBorderClass = () => {
    if (expanded && !disabled) {
      return "expanded";
    }
    if (state === AccordianStates.error || state === AccordianStates.default) {
      return "accordion";
    }
    return "accordionDeselected";
  };

  return (
    <Box className={classes.container}>
      {chipText && (
        <Chip
          label={
            <Typography variant={TypographyVariants.bodyTinyHighEmphasis} colorValue={semColors.neutral.text.highEmphasisInverse}>
              {chipText}
            </Typography>
          }
          className={classes.chipClass}
        />
      )}
      <Boundary className={containerClassName ? containerClassName : classes[getBorderClass()]}>
        <MuiAccordion
          id={id}
          data-testid={id}
          expanded={expanded}
          disabled={disabled}
          className={cx(
            classes.rootAccordian,
            disabled && classes.disabled,
            type === AccordionType.secondary && classes.expandIconPosition,
            className
          )}
          onChange={handleChange()}>
          <AccordionSummary expandIcon={<ExpandIcon />}>
            {headingContainer ? (
              headingContainer
            ) : (
              <Grid container alignItems={type === AccordionType.primary ? "center" : "flex-start"}>
                <Grid item className={type === AccordionType.primary ? classes.icon : classes.iconSmall}>
                  {iconSrc ? (
                    <Icon src={iconSrc} />
                  ) : (
                    <MvSvgIcon
                      name={iconName}
                      height={type === AccordionType.primary ? projectTokens.iconSizing[48] : iconSizing.medium}
                      width={type === AccordionType.primary ? projectTokens.iconSizing[48] : iconSizing.medium}
                      classes={classes.accordionSummaryIcon}
                    />
                  )}
                </Grid>
                <Grid item className={classes.heading}>
                  <Grid container direction={"column"}>
                    <Grid item>
                      <Typography
                        variant={
                          disabled || state === AccordianStates.success || state === AccordianStates.saving
                            ? TypographyVariants.bodyMediumLowEmphasis
                            : TypographyVariants.bodyMediumHighEmphasis
                        }
                        colorValue={semColors.neutral.text.mediumEmphasis}>
                        {label}
                      </Typography>
                    </Grid>
                    {subTitle && (
                      <Grid item>
                        <Typography variant={TypographyVariants.bodySmallLowEmphasis} colorValue={semColors.neutral.text.lowEmphasis}>
                          {subTitle}
                        </Typography>
                      </Grid>
                    )}
                    {(description || descriptionIcon) && (
                      <Grid item className={classes.description}>
                        {descriptionIcon && (
                          <MvSvgIcon
                            name={descriptionIcon}
                            classes={classes.descriptionIcon}
                            width={theme.tokens.sizing.xSmall}
                            height={theme.tokens.sizing.xSmall}
                          />
                        )}
                        <Typography variant={TypographyVariants.bodyTinyLowEmphasis} colorValue={semColors.neutral.text.lowEmphasis}>
                          {description}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
                <Grid item>
                  {(state === AccordianStates.error || state === AccordianStates.success) && (
                    <MvSvgIcon name={iconVariant[state]} classes={classes.status} />
                  )}
                  {state === AccordianStates.saving && (
                    <div className={classes.circle}>
                      <CircularProgress className={cx(classes.saving, classes.foreground)} size={18} thickness={6} />
                      <CircularProgress
                        variant="determinate"
                        value={100}
                        size={18}
                        className={cx(classes.savingBackground, classes.background)}
                        thickness={6}
                      />
                    </div>
                  )}
                </Grid>
              </Grid>
            )}
          </AccordionSummary>
          {!disabled && <AccordionDetails>{children}</AccordionDetails>}
        </MuiAccordion>
      </Boundary>
    </Box>
  );
}
