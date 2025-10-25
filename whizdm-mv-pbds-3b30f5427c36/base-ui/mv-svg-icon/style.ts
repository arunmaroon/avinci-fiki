import { makeStyles } from "tss-react/mui";

export const useStyles: Function = makeStyles()((theme, { width, height, color }: any) => {
  return {
    root: {
      "&.MuiSvgIcon-root": {
        width,
        height,
        ...(color && { fill: color }),
      },
    },
  };
});
