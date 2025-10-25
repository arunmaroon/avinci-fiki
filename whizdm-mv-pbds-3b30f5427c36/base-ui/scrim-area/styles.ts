import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme) => {
  const { scrimArea } = theme.tokens;

  return {
    scrim: {
      width: "100%",
      height: "100%",
      backgroundColor: scrimArea.background.color,
      opacity: scrimArea.opacity,
    },
  };
});
