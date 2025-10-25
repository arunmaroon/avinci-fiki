"use client";

import { createTheme } from "@mui/material";
import colors from "./colors";
import { fontWeights } from "./web-componentsConstants";

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xxs: true;
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
  }
}

// Two varints of break points
// Navbar ---> 960 to 1200 and 1200 to 1440
/* 
    fontSize/fontWeight/lineHeight
    varaint1 --> 16px, regular/bold/semibold, lh-28px/19px/24px
    V2 ---> 20px, regular, lh-28px
    V3 ---> 24px, regular, lh-36px 
    V4 ---> 63px, bold, lh-76px 
    V5 ---> 7px,
    V6 ---> 18px, 
    V7 ---> 36px, bold,  lh-44px 
    V8 ---> 12px, semibold, lh: 14px 
    V9 ---> 32px, bold, lh: 40px
*/

const theme = createTheme({
  spacing: [0, 4, 8, 16, 32],
  breakpoints: {
    values: {
      xxs: 0,
      xs: 360,
      sm: 480,
      md: 768,
      lg: 960,
      xl: 1280,
    },
  },
  palette: {
    primary: {
      main: colors["--primary-color"],
    },
    secondary: {
      main: colors["--white-color"],
    },
  },
  typography: {
    fontFamily: "AtAero",
    h1: {
      fontSize: "32px",
      fontWeight: fontWeights["--font-weight-bold"],
      lineHeight: "42px",
    },
    h2: {
      fontSize: "28px",
      fontWeight: fontWeights["--font-weight-bold"],
      lineHeight: "42px",
    },
    h3: {
      fontSize: "20px",
      fontWeight: fontWeights["--font-weight-semibold"],
      lineHeight: "28px",
    },
    h5: {
      fontSize: "14px",
      fontWeight: fontWeights["--font-weight-semibold"],
      lineHeight: "20px",
    },
    h6: {
      fontSize: "7px",
      fontWeight: fontWeights["--font-weight-semibold"],
      lineHeight: "12px",
    },
    body1: {
      fontSize: "16px",
      fontWeight: fontWeights["--font-weight-regular"],
      lineHeight: "28px",
    },
    body2: {
      fontSize: "12px",
      fontWeight: fontWeights["--font-weight-regular"],
      lineHeight: "20px",
    },
    subtitle1: {
      fontSize: "16px",
      fontWeight: fontWeights["--font-weight-regular"],
      lineHeight: "24px",
    },
    subtitle2: {
      fontSize: "18px",
      fontWeight: fontWeights["--font-weight-regular"],
      lineHeight: "28px",
    },
    // subtitle3: { //smart pay terms and condition text
    //   fontSize: "12px",
    //   fontWeight: fontWeights["--font-weight-regular"],
    //   lineHeight: "18px",
    // },
    // subtitle3:{//footer
    //   fontSize: "14px",
    //   fontWeight: fontWeights["--font-weight-regular"],
    //   lineHeight: "20px",
    // }
    // h4: { //footer heading and for hamburger calculators items
    //   fontSize: "14px",
    //   fontWeight: fontWeights["--font-weight-semibold"],
    //   lineHeight: "24px",
    // }
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h1: "h1",
          h2: "h2",
          h3: "h3",
          h4: "h4",
          h5: "p",
          h6: "p",
          subtitle1: "p",
          subtitle2: "p",
          body1: "p",
          body2: "span",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          // backgroundColor: colors["--primary-color"],
          color: colors["--white-color"],
          boxShadow: "none",
          fontWeight: "600",
          textTransform: "none",
          "&:hover": {
            // backgroundColor: colors["--primary-color"],
            boxShadow: "none",
          },
        },
      },
    },
  },
});

export default theme;
