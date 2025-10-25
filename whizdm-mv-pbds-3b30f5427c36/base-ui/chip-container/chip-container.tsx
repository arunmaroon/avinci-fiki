import React from "react";
import Typography from "@mvloans/base-ui.typography";
import { TypographyVariants } from "@mvloans/base-ui.common";
import { chipTypeConstants, chipVariantConstants } from "@mvloans/base-ui.chip";
import { Chip } from "@mvloans/base-ui.chip";
import { Grid } from "@mui/material";

import { useStyles } from "./styles";

interface OptionObject {
  label: string;
  value: string;
  variant?: "filled" | "outlined";
  className?: string;
  type?: string;
}
export type ChipContainerProps = {
  /**
   * Title for the container.
   */
  title: string;
  /**
   * Optional error for the container.
   */
  error?: string;
  /**
   * Render options that can be selected
   */
  options: Array<OptionObject>;
  /**
   * On Click handler to select the option
   */
  onClick: (e: React.SyntheticEvent, value: string) => void;
  /**
   * Value to be passed for option selection
   */
  value: Array<string> | string;
  /**
   * Is chip multi select or single select
   */
  isMultiSelect?: boolean;
  /**
   * Unique identifier
   */
  id: string;
  classes?: ChipClasses;
};

export interface ChipClasses {
  boundary?: string;
  chip?: string;
  selectedBoundary?: string;
  unselectedBoundary?: string;
  container?: string;
  titleContainer?: string;
}

export function ChipContainer({
  title,
  options = [],
  error,
  onClick,
  value = "",
  isMultiSelect = false,
  id,
  classes: propsClasses = {},
}: ChipContainerProps) {
  const { classes, cx, theme } = useStyles();
  const { semColors } = theme.tokens;

  return (
    <Grid container flexDirection={"column"} className={cx(classes.container, propsClasses.container)} gap={2} data-testid={id}>
      <Grid item className={cx(classes.titleContainer, propsClasses.titleContainer)}>
        <Grid container gap={0.5} flexDirection={"column"}>
          <Grid item>
            <Typography variant={TypographyVariants.bodyMediumLowEmphasis} colorValue={semColors.neutral.text.mediumEmphasis}>
              {title}
            </Typography>
          </Grid>
          {error && (
            <Grid item>
              <Typography
                variant={TypographyVariants.bodySmallLowEmphasis}
                colorValue={semColors.danger.text.primary}
                className={classes.errorClass}>
                {error}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid item>
        <Grid container gap={1} className={error ? classes.chipContainer : classes.gridContainerClassWithoutError}>
          {options.map((item, i) => {
            const selected = value && Array.isArray(value) ? value.includes(item.value) : item.value === value;
            return (
              <Grid item key={i}>
                <Chip
                  label={item.label}
                  variant={chipVariantConstants.OUTLINED}
                  type={chipTypeConstants.SINGLE_SELECT}
                  selected={selected}
                  onClick={(e, value) => onClick && onClick(e, value)}
                  value={item.value}
                  checked={isMultiSelect && selected}
                  classes={propsClasses}
                />
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
}
