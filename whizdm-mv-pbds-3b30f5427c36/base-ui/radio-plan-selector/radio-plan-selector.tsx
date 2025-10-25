import React, { ReactNode, useState } from "react";
import { Radio, RadioGroup, FormControlLabel, FormControl, Collapse, Grid } from "@mui/material";
import { StateIcons } from "@mvloans/base-ui.radio-button";
import { PWA_ICONS, TypographyVariants } from "@mvloans/base-ui.common";
import Typography from "@mvloans/base-ui.typography";
import Icon from "@mvloans/base-ui.icon";

import { useStyles } from "./styles";
import { radioIcons } from "./constants";

export type RadioPlanSelectorProps = {
  /**
   * To grab element for testing
   */
  dataTestId?: string;
  /**
   * Options to display
   */
  options: Array<RadioPlanSelectorOptionsInterface>;
  /**
   * Custom classes
   */
  classes?: {
    formControl?: string;
    formControlLabel?: string;
    titleChild?: string;
    radio?: string;
    collapse?: string;
  };
  /**
   * Use this to pass default selected value as well
   */
  value?: string | null;
  /**
   * Custom icons for radio
   */
  stateIcons?: StateIcons;
  /**
   * Function for onChange
   */
  onChange?: (event: React.BaseSyntheticEvent, value: string) => void;
  /**
   * Display the number of rows
   */
  displayCount?: number;
};

export interface RadioPlanSelectorOptionsInterface {
  title: string;
  subTitle: string;
  value: string;
  titleChild: ReactNode;
  content: Array<RadioPlanSelectorOptionsContentInterface>;
  id: string;
}

export interface RadioPlanSelectorOptionsContentInterface {
  label: string;
  helper: string;
  value: string;
}

export function RadioPlanSelector(props: RadioPlanSelectorProps) {
  const { classes: propsClasses = {}, value = null, stateIcons = { ...radioIcons }, onChange, options, displayCount = 5 } = props;
  const [selectedOption, setSelectedOption] = useState(value);

  const [displayedCount, setDisplayedCount] = useState(displayCount);

  const handleChange = (event: React.BaseSyntheticEvent) => {
    setSelectedOption(event.target.value);
    onChange && onChange(event, options[event.target.value].id);
  };

  const getIcon = (isCheckedIcon = false): JSX.Element => {
    let iconName = stateIcons.default;

    if (isCheckedIcon) {
      iconName = stateIcons.selected;
    }
    //@ts-ignore
    return <Icon iconName={iconName} className={classes.iconClass} append={PWA_ICONS} />;
  };

  const getRemainingCount = () => {
    let result = 0;

    if (options?.length <= displayCount) {
      result = -1;
    } else {
      if (options?.length - displayedCount >= 0) {
        result = options?.length - displayedCount;
      } else {
        result = 0;
      }
    }
    return result;
  };

  const remainingCount = getRemainingCount();

  const getDisplayCountMessage = () => {
    let result = "";
    if (remainingCount <= 0) {
      result = "See less";
    } else {
      result = remainingCount >= displayCount ? `See ${displayCount} more` : `See ${remainingCount} more`;
    }
    return result;
  };

  const { classes, cx, theme } = useStyles();
  const { semColors } = theme.tokens;

  return (
    <>
      <FormControl component="fieldset" className={cx(classes.formControl, propsClasses.formControl)}>
        <RadioGroup name="radio-plan-selector" value={selectedOption} onChange={handleChange}>
          {options.slice(0, displayedCount).map((option, index) => (
            <Grid container key={index} className={cx(index === options.length - 1 ? "" : classes.rowBorder, classes.paddingBlock16)}>
              <Grid item xs={12}>
                <Grid container alignItems="center" className={cx(classes.marginBottom4, classes.formGrid)}>
                  <Grid item>
                    <FormControlLabel
                      value={index.toString()}
                      className={cx(classes.withoutPrefixLabelClass, propsClasses.formControlLabel)}
                      control={
                        <Radio
                          className={cx(classes.withoutPrefixRadioClass, propsClasses.radio)}
                          disableRipple
                          checkedIcon={getIcon(true)}
                          icon={getIcon()}
                        />
                      }
                      label={
                        <>
                          <Typography
                            variant={TypographyVariants.bodyMediumLowEmphasis}
                            colorValue={semColors.neutral.text.mediumEmphasis}
                            className={cx({ [classes.fontWeightBold]: selectedOption === index.toString() })}>
                            {option.title}
                          </Typography>
                          <Typography variant={TypographyVariants.bodySmallLowEmphasis} colorValue={semColors.neutral.text.lowEmphasis}>
                            {option.subTitle}
                          </Typography>
                        </>
                      }
                    />
                  </Grid>
                  <Grid item>
                    <Typography
                      variant={TypographyVariants.bodyMediumLowEmphasis}
                      colorValue={semColors.neutral.text.mediumEmphasis}
                      className={cx({ [classes.fontWeightBold]: selectedOption === index.toString() })}>
                      {option.value}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container className={cx(classes.marginLeft40, propsClasses.titleChild)}>
                  <Grid item>{option.titleChild}</Grid>
                </Grid>
                {selectedOption === index.toString() && (
                  <Collapse in={selectedOption === index.toString()} className={cx(classes.marginLeft40, propsClasses.collapse)}>
                    {option.content.map((content: RadioPlanSelectorOptionsContentInterface, innerIndex: number) => (
                      <Grid container alignItems="center" key={innerIndex} className={classes.formGrid}>
                        <Grid item className={classes.marginTop4}>
                          <Typography
                            variant={TypographyVariants.bodySmallLowEmphasis}
                            colorValue={semColors.neutral.text.mediumEmphasis}
                            component={"p"}>
                            {content.label}
                          </Typography>
                          <Typography
                            variant={TypographyVariants.bodySmallLowEmphasis}
                            colorValue={semColors.neutral.text.lowEmphasis}
                            component={"p"}>
                            {content.helper}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant={TypographyVariants.bodySmallLowEmphasis} colorValue={semColors.neutral.text.mediumEmphasis}>
                            {content.value}
                          </Typography>
                        </Grid>
                      </Grid>
                    ))}
                  </Collapse>
                )}
              </Grid>
            </Grid>
          ))}
        </RadioGroup>
      </FormControl>
      {remainingCount >= 0 && (
        <Grid container>
          <Grid item xs={12} className={classes.displayCardClass}>
            <Typography
              variant={TypographyVariants.bodySmallHighEmphasis}
              colorValue={theme.tokens.semColors.neutral.text.mediumEmphasis}
              onClick={() => setDisplayedCount(remainingCount <= 0 ? displayCount : displayedCount + displayCount)}>
              {getDisplayCountMessage()}
              <Icon
                iconName={remainingCount <= 0 ? radioIcons.upArrow : radioIcons.downArrow}
                append={PWA_ICONS}
                width={theme.tokens.sizing.xSmall}
                className={classes.showCards}
              />
            </Typography>
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default RadioPlanSelector;
