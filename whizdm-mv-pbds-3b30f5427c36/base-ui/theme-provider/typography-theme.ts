import { TypographyVariants, variantMappingConstants } from "@mvloans/base-ui.common";
import { pothosTokens } from "@mvloans/base-ui.tokens";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    pageTitle: React.CSSProperties;
    paragraphLeading: React.CSSProperties;
    paragraphDefault: React.CSSProperties;
    paragraphSmall: React.CSSProperties;
    buttonLarge: React.CSSProperties;
    buttonDefault: React.CSSProperties;
    buttonSmall: React.CSSProperties;
    sectionTitle: React.CSSProperties;
    subTitle: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    pageTitle?: React.CSSProperties;
    paragraphLeading?: React.CSSProperties;
    paragraphDefault?: React.CSSProperties;
    paragraphSmall?: React.CSSProperties;
    buttonLarge?: React.CSSProperties;
    buttonDefault?: React.CSSProperties;
    buttonSmall?: React.CSSProperties;
    sectionTitle?: React.CSSProperties;
    subTitle?: React.CSSProperties;
  }
}
// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    variant?: TypographyVariants;
  }
}

export const muiTypographyTheme = {
  MuiTypography: {
    defaultProps: {
      variantMapping: variantMappingConstants,
    },
  },

  typography: () => {
    //Use palette IF default color needed
    return {
      allVariants: {
        margin: undefined,
        lineHeight: "normal",
        fontSize: 10,
        fontFamily: "AT Aero, sans-serif",
      },
      h5: undefined,
      h6: undefined,
      ...(pothosTokens.typography as {
        [key in TypographyVariants]: {
          fontFamily: string;
          fontWeight: string;
          fontSize: string;
          lineHeight: string;
          letterSpacing: string;
          textDecoration: string;
        };
      }),
    };
  },

  MuiLink: {
    styleOverrides: {
      root: () => {
        return {
          color: "inherit",
          textDecorationColor: "inherit",
          cursor: "pointer",
        };
      },
    },
  },
};
