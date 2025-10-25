import { makeStyles } from "tss-react/mui";

export const useStyles: Function = makeStyles()((theme) => ({
  titleContainer: {
    "& p": {
      margin: "0px",
    },
  },

  container: {
    width: "100%",
  },

  chipContainer: {
    "&& .MuiGrid-item": {
      paddingTop: "0px",
    },
  },
}));
