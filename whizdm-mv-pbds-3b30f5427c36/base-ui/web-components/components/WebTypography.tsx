import React from "react";
import { Typography as MVWebTypography, SxProps, TypographyProps } from "@mui/material";

type FontWeight = "retina" | "semibold" | "bold";
type FontSize = "extraSmall" | "small" | "medium" | "large" | "extraLarge" | "regular" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface CustomTypographyProps extends Omit<TypographyProps, "variant"> {
  weight?: FontWeight;
  variantType?: FontSize;
  color?: string;
  overrideStyle?: SxProps;
}

// Define the variant types
export enum WebTypographyVariants {
  extraSmall = "extraSmall",
  small = "small",
  medium = "medium",
  large = "large",
  extraLarge = "extraLarge",
  regular = "regular",
  h1 = "h1",
  h2 = "h2",
  h3 = "h3",
  h4 = "h4",
  h5 = "h5",
  h6 = "h6",
}

export enum fontWeightVariants {
  retina = "retina",
  semibold = "semibold",
  bold = "bold",
}

const fontSizes = {
  extraSmall: 12,
  small: 14,
  medium: 16,
  large: 20,
  extraLarge: 22,
  regular: 18,
  h1: 48,
  h2: 32,
  h3: 24,
  h4: 20,
  h5: 18,
  h6: 16,
};

const fontWeights = {
  retina: 350,
  semibold: 600,
  bold: 700,
};

const lineHeights = {
  extraSmall: 1.7,
  small: 1.7,
  medium: 1.7,
  large: 1.7,
  extraLarge: 1.7,
  regular: 1.7,
  h1: 1.2,
  h2: 1.3,
  h3: 1.35,
  h4: 1.4,
  h5: 1.45,
  h6: 1.5,
};

// Define font styles for each variant
// export interface FontStyle {
//   fontFamily: string;
//   fontSize: { [key: string]: string };
//   lineHeight?: number | string;
//   fontWeight?: number | string;
// }

// const createFontStyle = (
//   fontSizes: { sm: string; md: string; lg: string },
//   lineHeightsPercent?: string,
//   fontWeight?: number | string
// ): FontStyle => {
//   return {
//     fontFamily: 'At Aero, sans-serif',
//     fontSize: fontSizes[variantType],
//     fontWeight: fontWeights[weight],
//     lineHeight: lineHeights[variantType],
//     letterSpacing: '0%',
//   };
// };

// export interface FontStylesProps {
//   [key: string]: FontStyle;
// }

const fontStyles = {
  h1: { xs: "48px", md: "64px", xl: "80px" },
  h2: { xs: "32px", md: "38px", xl: "44px" },
  h3: { xs: "24px", md: "30px", xl: "36px" },
  h4: { xs: "20px", md: "24px", xl: "28px" },
  h5: { xs: "18px", md: "21px", xl: "24px" },
  h6: { xs: "16px", md: "18px", xl: "20px" },
  extraSmall: { xs: "12px", md: "12px", xl: "14px" }, // Extra Small
  small: { xs: "14px", md: "14px", xl: "16px" }, // Small
  medium: { xs: "16px", md: "16px", xl: "18px" }, // Medium
  regular: { xs: "18px", md: "18px", xl: "20px" }, // Regular
  large: { xs: "20px", md: "20px", xl: "22px" }, // Large
  extraLarge: { xs: "22px", md: "22px", xl: "24px" }, // Extra Large
};

export const WebTypography: React.FC<CustomTypographyProps> = ({
  children,
  weight = "retina",
  variantType = "medium",
  color = "black",
  overrideStyle = {},
  ...props
}) => {
  const StyledTypography = {
    fontSize: fontStyles[variantType],
    fontWeight: fontWeights[weight],
    lineHeight: lineHeights[variantType],
    letterSpacing: "0",
    color: color,
  };

  return (
    <MVWebTypography sx={{ ...StyledTypography, ...overrideStyle }} {...props}>
      {children}
    </MVWebTypography>
  );
};

export default WebTypography;
