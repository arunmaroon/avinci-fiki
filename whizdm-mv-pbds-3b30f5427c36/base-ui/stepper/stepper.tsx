import React, { useEffect, useState } from "react";

import { Avatar, Box, Step, StepButton, StepLabel, Stepper as MuiStepper, Divider } from "@mui/material";

import { PWA_ICONS, TypographyVariants } from "@mvloans/base-ui.common";
import Typography from "@mvloans/base-ui.typography";
import { MvSvgIcon } from "@mvloans/base-ui.mv-svg-icon";
import { MVTheme } from "@mvloans/base-ui.theme-provider";

import { constants, icons } from "./constants";
import { useStyles } from "./styles";

export interface StepType {
  stepperKey: string;
  order: number;
  label: string;
  route: string;
  status: string;
  iconName?: string;
  iconClass?: string;
}

export type StepperProps = {
  /**
   * Array of labels for the stepper.
   */
  steps: StepType[];
  /**
   * The index of the stepper.
   */
  activeStepIndex: number;

  /**
   * Controlling selection of step from parent and its optional
   */
  controlSelectedKey?: null | string;

  /**
   * Function to handle the click on the steppers.
   */
  onStepClick: (route: string) => void;

  /**Stepper state icons */
  stateIcons?: StateIcons;

  /**
   * Additional classes to override.
   */
  classes?: StepperClasses;
};

export interface StepperClasses {
  stepperRoot?: string;
  iconContainer?: string;
  avatarClass?: string;
  stepSelected?: string;
  stepsCompleted?: string;
  stepActive?: string;
  stepsRemaining?: string;
}

export interface StateIcons {
  stepperFilledSuccess: string;
  stepperUnFilledSuccess: string;
  stepperOutline: string;
  stepperOutlineSuccess: string;
}

const customStepIcon = (
  status: string,
  index: number,
  selectedStep: number,
  classes: any,
  propsClasses: StepperClasses,
  stateIcons: StateIcons,
  cx: any,
  theme: MVTheme,
  iconName?: string,
  iconClass?: string
) => {
  return () => (
    <Box className={cx(propsClasses.iconContainer, classes.iconContainer)}>
      {status === constants.COMPLETED && index === selectedStep ? (
        // iconAdjust* - Adjusts <MvSvgIcon /> to match the appearance of the old <Icon />
        <MvSvgIcon
          name={iconName || stateIcons.stepperFilledSuccess}
          append={PWA_ICONS}
          classes={cx(classes.iconClass24, propsClasses.stepSelected || classes.iconAdjustStepperFilledSuccess, iconClass)}
          dataTestId={"stepperFilledSuccess"}
        />
      ) : (
        status === constants.COMPLETED && (
          <MvSvgIcon
            name={iconName || stateIcons.stepperUnFilledSuccess}
            append={PWA_ICONS}
            classes={cx(
              classes.iconClass16,
              classes.paddingTop4,
              propsClasses.stepsCompleted || classes.iconAdjustStepperUnFilledSuccess,
              iconClass
            )}
            dataTestId={"stepperUnFilledSuccess"}
          />
        )
      )}

      {status === constants.ACTIVE && index === selectedStep ? (
        <Avatar className={cx(propsClasses.avatarClass, classes.avatarClass, classes.iconClass24, iconClass)}>
          <Typography variant={TypographyVariants.bodyTinyLowEmphasis} colorValue={theme.tokens.semColors.neutral.text.highEmphasisInverse}>
            {index + 1}
          </Typography>
        </Avatar>
      ) : (
        status === constants.ACTIVE && (
          <MvSvgIcon
            name={iconName || stateIcons.stepperOutlineSuccess}
            append={PWA_ICONS}
            classes={cx(
              classes.iconClass16,
              classes.paddingTop4,
              propsClasses.stepActive || classes.iconAdjustStepperOutlineSuccess,
              iconClass
            )}
            dataTestId={"stepperOutlineSuccess"}
          />
        )
      )}

      {status === constants.DISABLED && (
        <MvSvgIcon
          name={iconName || stateIcons.stepperOutline}
          append={PWA_ICONS}
          classes={cx(classes.iconClass16, classes.paddingTop4, propsClasses.stepsRemaining || classes.iconAdjustStepperOutline, iconClass)}
          dataTestId={"stepperOutline"}
        />
      )}
    </Box>
  );
};

export function Stepper({
  steps = [],
  activeStepIndex = -1,
  controlSelectedKey = null,
  onStepClick = () => {},
  classes: propsClasses = {},
  stateIcons = { ...icons },
}: StepperProps) {
  const { classes, cx, theme } = useStyles({ steps });
  const { semColors } = theme.tokens;
  const [selectedStep, setSelectedStep] = useState(activeStepIndex);

  const handleClick = (route: string, index: number) => {
    setSelectedStep(index);
    onStepClick(route);
  };

  useEffect(() => {
    if (controlSelectedKey) {
      const stepDetails = steps.find((step) => step.stepperKey === controlSelectedKey && step.status === constants.COMPLETED) as StepType;
      if (stepDetails) setSelectedStep(stepDetails.order - 1);
    } else if (activeStepIndex > -1) {
      setSelectedStep(activeStepIndex);
    }
  }, [controlSelectedKey, activeStepIndex]);

  return (
    <MuiStepper
      alternativeLabel
      activeStep={activeStepIndex}
      className={cx(propsClasses.stepperRoot, classes.stepperRoot)}
      connector={null}>
      {steps
        .sort((a, b) => {
          return a.order - b.order;
        })
        .map((step: StepType, index: number) => {
          const { stepperKey, status, label, route, iconName, iconClass } = step;
          const activeOrCompletedAndSelectedStep =
            index === selectedStep && (status === constants.ACTIVE || status === constants.COMPLETED);

          return (
            <Step key={stepperKey} completed={status === constants.COMPLETED}>
              {/* Divider to the left of StepIcon */}
              {index !== 0 && (
                <Divider
                  className={cx({
                    [classes.divider]: true,
                    [classes.disabledDivider]: index > activeStepIndex,
                    [classes.leftDivider]: index !== 0,
                    [classes.widthClass12]: activeOrCompletedAndSelectedStep,
                  })}
                />
              )}
              {/* Divider to the right of StepIcon */}
              {index !== steps.length - 1 && (
                <Divider
                  className={cx({
                    [classes.divider]: true,
                    [classes.disabledDivider]: index >= activeStepIndex,
                    [classes.rightDivider]: index !== steps.length - 1,
                    [classes.widthClass12]: activeOrCompletedAndSelectedStep,
                  })}
                />
              )}
              <StepButton
                data-testid={label}
                onClick={() => {
                  handleClick(route, index);
                }}
                disabled={status === constants.DISABLED}>
                <StepLabel
                  className={cx({
                    [classes.muiActiveLabelTopMargin1]: status === constants.ACTIVE && index === selectedStep,
                    [classes.muiCompletedLabelTopMargin1]: status === constants.COMPLETED && index === selectedStep,
                    [classes.muiActiveLabelTopMargin5]: status === constants.ACTIVE && index !== selectedStep,
                  })}
                  StepIconComponent={customStepIcon(
                    status,
                    index,
                    selectedStep,
                    classes,
                    propsClasses,
                    stateIcons,
                    cx,
                    theme,
                    iconName,
                    iconClass
                  )}>
                  <Typography
                    variant={
                      activeOrCompletedAndSelectedStep ? TypographyVariants.bodySmallHighEmphasis : TypographyVariants.bodySmallLowEmphasis
                    }
                    colorValue={status === constants.DISABLED ? semColors.neutral.text.lowEmphasis : semColors.neutral.text.mediumEmphasis}>
                    {label}
                  </Typography>
                </StepLabel>
              </StepButton>
            </Step>
          );
        })}
    </MuiStepper>
  );
}
