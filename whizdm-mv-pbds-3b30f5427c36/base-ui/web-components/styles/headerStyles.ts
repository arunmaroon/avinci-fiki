import { makeStyles } from "tss-react/mui";

export const useStyles: Function = makeStyles()((theme: any) => ({
  headerLogoClass: {
    width: "138px",
    height: "32px",
    [theme.breakpoints.up("lg")]: {
      width: "172px",
      height: "40px",
    },
  },
}));
