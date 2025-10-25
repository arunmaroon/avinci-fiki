import React from "react";

import { Button as MuiButton, Skeleton, SkeletonOwnProps } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { variantConstants } from "@mvloans/base-ui.common";
import Typography from "@mvloans/base-ui.typography";
import { MvSvgIcon, IconNames, IconPosition } from "@mvloans/base-ui.mv-svg-icon";
import { buttonVariantConstants, skeletonVariants } from "./constants";
import { getTypographyVariant } from "./utils";
import { useStyles } from "./styles";

export type ButtonProps = {
  /** Text to be rendered within the button. */
  children: string;

  /** Set the size of button. */
  size?: "buttonDefault" | "buttonSmall" | string;

  iconPosition?: IconPosition.left | IconPosition.right;

  /** Choose the type of button from contained, outlined or text */
  variant?: buttonVariantConstants;

  /** Disable button. */
  disabled?: boolean;

  /** Choose to include the icon in the button. */
  withIcon?: boolean;

  /** Set the icon using icon name. */
  iconName?: string;

  id?: string;

  /** Attach click event to button. */
  onClick?: (e: any) => void;

  /** ClassName Property for button */
  className?: string;

  isSkeleton?: boolean;

  isLoading?: boolean;
};

export const Button = ({
  children,
  size = variantConstants.BUTTONDEFAULT,
  variant = buttonVariantConstants.PRIMARY,
  disabled = false,
  withIcon = false,
  iconName = IconNames.rightArrowContained,
  iconPosition = IconPosition.right,
  isSkeleton = false,
  isLoading = false,
  id,
  onClick,
  className,
}: ButtonProps) => {
  const { classes, cx, theme } = useStyles({ variant, size, isSkeleton, isLoading });

  if (isLoading) {
    return <LoadingButton data-testid={id} className={cx(classes.root, classes[size], className)} loading={isLoading}></LoadingButton>;
  }
  if (isSkeleton) {
    return (
      <Skeleton
        data-testid={id}
        variant={skeletonVariants.rectangular as SkeletonOwnProps["variant"]}
        className={cx(classes.root, classes[size], className)}
      />
    );
  }

  return (
    <MuiButton
      id={id}
      className={cx(classes.root, classes[size], className)}
      data-testid={id}
      disabled={disabled}
      disableRipple={true}
      startIcon={
        withIcon &&
        iconPosition === IconPosition.left && (
          <MvSvgIcon width={theme.tokens.sizing.xSmall} height={theme.tokens.sizing.xSmall} name={iconName} />
        )
      }
      endIcon={
        withIcon &&
        iconPosition === IconPosition.right && (
          <MvSvgIcon width={theme.tokens.sizing.xSmall} height={theme.tokens.sizing.xSmall} name={iconName} />
        )
      }
      onClick={onClick}>
      <Typography variant={getTypographyVariant({ variant, size, theme })}>{children}</Typography>
    </MuiButton>
  );
};
