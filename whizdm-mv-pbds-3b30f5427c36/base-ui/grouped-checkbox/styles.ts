import { makeStyles } from "tss-react/mui";

export const useStyles: Function = makeStyles()((theme) => ({
  titleContainer: {
    "& p": {
      margin: "0px",
    },
  },
  container: {
    width: "100%",
    padding: "16px 0",
  },
  groupCheckboxItem: {
    padding: "8px 0",
  },
}));
