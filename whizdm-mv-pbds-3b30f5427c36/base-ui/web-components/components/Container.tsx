import React from "react";
import Box from "@mui/material/Box";

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        display: "grid",
        justifyContent: "center",
        columnGap: {
          xxs: "12px",
          md: "12px",
          lg: "12px",
          xl: "20px",
        },
        gridTemplateColumns: {
          xxs: "repeat(6, 1fr)",
          md: "repeat(12, 48px)",
          lg: "repeat(12, 59px)",
          xl: "repeat(12, 80px)",
        },
        margin: {
          xxs: "0 24px 0 24px",
          md: "0 30px 0 30px",
          lg: "0 60px 0 60px",
          xl: "0px 130px 0 130px",
        },
      }}>
      {children}
    </Box>
  );
};
export default Container;
