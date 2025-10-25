import React from "react";
import { Container } from "@mui/material";

const Layout = ({ id, children }: { id?: string; children: React.ReactNode }) => {
  return (
    <Container
      sx={{
        width: "100%",
        marginInline: "auto",
        maxWidth: { xxs: "1924px" },
        padding: { xl: "0px 96px", md: "0px 24px", xxs: "0px 16px" },
      }}
      component="section"
      id={id}>
      {children}
    </Container>
  );
};

export default Layout;
