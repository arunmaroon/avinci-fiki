import React, { useEffect } from "react";

import { Slider as MuiSlider, SliderThumb } from "@mui/material";

import { IconNames, MvSvgIcon } from "@mvloans/base-ui.mv-svg-icon";

import { useStyles } from "./style";
import { sliderVariants } from "./constants";

export type SliderProps = {
  id?: string;
  className?: string;
  value?: number | Array<number>;
  defaultValue?: number;
  onChange?: (e: any) => void;
  variant?: sliderVariants;
  min?: number;
  max?: number;
  step?: number | null;
  marks?: boolean | Array<Mark>;
  disabled?: boolean;
  thumbIcon?: string;
};

interface Mark {
  value: number;
  label?: React.ReactNode;
}

const CustomThumb = (props: any) => {
  const { children, icon, theme, variant, knob, ...other } = props;

  return (
    <SliderThumb {...other}>
      {children}
      <MvSvgIcon width={knob.sizing} height={knob.sizing} name={icon} />
    </SliderThumb>
  );
};

export function Slider({
  id,
  value,
  defaultValue,
  onChange = () => {},
  min,
  max,
  step = null,
  marks,
  disabled,
  className,
  thumbIcon = IconNames.thumbHandleIcon,
  variant = sliderVariants.BLACK,
}: SliderProps) {
  const initialMarkValue = Array.isArray(marks) ?? (marks as Array<Mark>)?.[0]?.value;
  const lastMarkValue = Array.isArray(marks) ? marks[marks.length - 1]?.value : undefined;
  const [sliderValue, setSliderValue] = React.useState(() => defaultValue ?? value ?? min ?? initialMarkValue ?? 0);
  const { classes, theme } = useStyles({
    variant,
    isAtStart: sliderValue === min || sliderValue === initialMarkValue,
    isAtEnd: sliderValue === max || sliderValue === lastMarkValue,
  });

  useEffect(() => {
    setSliderValue(defaultValue ?? value ?? min ?? initialMarkValue);
  }, [defaultValue, value, min, initialMarkValue]);

  const { slider } = theme.tokens;
  const { knob } = slider[variant];
  const handleChange = (event: any) => {
    setSliderValue(event.target.value);
    onChange && onChange(event);
  };
  return (
    <MuiSlider
      id={id}
      value={value}
      defaultValue={defaultValue}
      onChange={handleChange}
      min={min}
      max={max}
      step={step}
      marks={marks}
      disabled={disabled}
      data-testid={id}
      classes={{
        root: classes.root,
        track: classes.track,
        rail: classes.rail,
        disabled: classes.disabled,
        thumb: classes.thumb,
        markLabel: classes.markLabel,
        mark: classes.mark,
      }}
      className={className}
      components={{ Thumb: (thumbProps) => <CustomThumb knob={knob} {...thumbProps} theme={theme} /> }}
      slotProps={{
        thumb: () => {
          return { icon: thumbIcon };
        },
      }}
    />
  );
}
