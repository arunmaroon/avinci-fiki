import { TypographyVariants, variantConstants } from "@mvloans/base-ui.common";

import { buttonVariantConstants } from "./constants";

export const getTypographyVariant = ({ variant, size, theme }: any) => {
  const { BUTTONSMALL, BUTTONDEFAULT } = variantConstants;
  const { LINK } = buttonVariantConstants;

  // Map button size to corresponding typography variant
  const sizeToTypography: { [key: string]: TypographyVariants } = {
    [BUTTONSMALL]: theme.tokens.button.small.text.typography,
    [BUTTONDEFAULT]: theme.tokens.button.text.typography,
  };

  // Map button variant to corresponding typography variant
  const variantToTypography: { [key: string]: TypographyVariants } = {
    [LINK]: theme.tokens.button.link.text.typography,
  };

  // Return typography variant based on button variant and size
  if ((variantToTypography[variant as any] as TypographyVariants) && size !== BUTTONSMALL) {
    // If the variant is LINK and size is not BUTTONSMALL, use the specific typography
    return variantToTypography[variant as any] as TypographyVariants;
  } else {
    // If the variant is not LINK or size is BUTTONSMALL, use the size-based typography
    return sizeToTypography[size] || theme.tokens.button.small.text.typography;
  }
};

export const extractPropertyColor = (property: any, defaultColor: string = "transparent", colorProp: string = "color"): string => {
  return property?.[colorProp] ?? defaultColor;
};

export const extractEffect = (property: any): string => {
  return property?.effect ?? "none";
};
