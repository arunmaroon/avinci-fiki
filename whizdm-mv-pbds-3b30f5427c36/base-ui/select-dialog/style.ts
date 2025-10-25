import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme) => ({
  root: {
    position: "relative",
  },
  wrapper: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: "1",
    cursor: "pointer",
  },
}));
