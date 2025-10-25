import { makeStyles } from "tss-react/mui";
export const useStyles: Function = makeStyles()((theme) => ({
  boundaryContainer: {
    position: "relative",
  },
  boundary: {
    position: "absolute",
    margin: "0px",
    boxSizing: "border-box",
    overflow: "hidden",
    inset: 0,
    pointerEvents: "none",
  },
}));
