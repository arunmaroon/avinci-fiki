import React from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import { SxProps, Theme } from "@mui/material";
import colors from "../colors";

interface MvButtonProps extends Omit<ButtonProps, "variant"> {
  children: React.ReactNode;
  variant?: ButtonProps["variant"] | CustomVariant;
  disableRipple?: boolean;
  withIcon?: boolean;
  sizeVariant?: "normal" | "small";
  overrideStyle?: SxProps<Theme>;
  [key: string]: any;
}

export enum MvbuttonVariant {
  primaryBtn = "primaryBtn",
  supportPrimaryBtn = "supportPrimaryBtn",
  supportSecondaryBtn = "supportSecondaryBtn",
}

type CustomVariant = "primaryBtn" | "supportPrimaryBtn" | "supportSecondaryBtn";

const baseStyles: SxProps<Theme> = {
  padding: "18px 12px",
  fontSize: "16px",
  lineHeight: "20px",
  verticalAlign: "unset",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const commmonFocusOutlineStyle: SxProps<Theme> = {
  "&:focus-visible": {
    outline: `${colors["--primary-color"]} solid 2px`,
    outlineOffset: "2px",
  },
};

const variantStyles: Record<CustomVariant, SxProps<Theme>> = {
  primaryBtn: {
    backgroundColor: colors["--primary-color"],
    color: colors["--white-color"],
    borderRadius: "4px",
    boxSizing: "border-box",
    "&:hover": {
      backgroundColor: colors["--green07"],
    },
    "&:active": {
      backgroundColor: colors["--green07"],
    },
    ...commmonFocusOutlineStyle,
  },
  supportPrimaryBtn: {
    backgroundColor: colors["--white-color"],
    color: colors["--primary-color"],
    border: "1px solid",
    borderColor: colors["--primary-color"],
    borderRadius: "4px",
    boxSizing: "border-box",
    "&:hover": {
      border: "2px solid",
      backgroundColor: colors["--white-color"],
    },
    "&:active": {
      backgroundColor: colors["--grey01"],
    },
    ...commmonFocusOutlineStyle,
  },
  supportSecondaryBtn: {
    backgroundColor: colors["--white-color"],
    color: colors["--primary-color"],
    borderRadius: "4px",
    boxSizing: "border-box",
    "&:hover": {
      backgroundColor: colors["--green01"],
    },
    "&:active": {
      backgroundColor: colors["--green02"],
    },
    ...commmonFocusOutlineStyle,
  },
};

const MvButton: React.FC<MvButtonProps> = ({
  children,
  variant = "primaryBtn",
  sizeVariant = "normal",
  overrideStyle,
  withIcon = false,
  ...props
}) => {
  const customStyleVariant = variantStyles[variant as CustomVariant];
  const commonComponentStyles = { ...baseStyles, ...(customStyleVariant || {}) };
  return (
    <Button
      sx={{
        ...commonComponentStyles,
        ...(overrideStyle ?? {}),
        height: sizeVariant === "normal" ? "56px" : "40px",
      }}
      {...props}>
      {children}
      {withIcon && (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
          <path
            d="M8.862 12.362a.667.667 0 10.943.943l3.862-3.862c.52-.52.52-1.365 0-1.886L9.805 3.695a.667.667 0 10-.943.943l3.195 3.195h-9.39a.667.667 0 000 1.334h9.39l-3.195 3.195z"
            fill="currentColor"
          />
        </svg>
      )}
    </Button>
  );
};

export default MvButton;
