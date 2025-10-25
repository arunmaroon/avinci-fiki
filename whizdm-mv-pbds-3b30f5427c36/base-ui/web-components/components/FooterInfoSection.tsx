import React from "react";
import colors from "../colors";
import { Box, Grid } from "@mui/material";

import Layout from "./NewLayout";
import WebTypography from "./WebTypography";
import { fontWeights, footerInfoSections } from "../web-componentsConstants";

const FooterInfoSection = () => {
  return (
    <Box sx={{ backgroundColor: colors["--black-ash"], marginBottom: { xl: "0px", xxs: "48px" } }}>
      <Layout>
        <Grid container sx={{ flexDirection: "column", paddingBlock: { md: "50px", xxs: "24px" }, gap: { md: "initial", xxs: "18px" } }}>
          {footerInfoSections.map((section, index) => (
            <React.Fragment key={index}>
              {section.items.map((item, idx) => (
                <Grid item key={idx} flexDirection={"column"}>
                  <WebTypography variantType="extraSmall" color={colors["--grey15"]}>
                    <span style={{ fontWeight: fontWeights["--font-weight-semibold"] }}>{item.boldText}</span>
                    {item.description}
                  </WebTypography>
                </Grid>
              ))}
            </React.Fragment>
          ))}
        </Grid>
      </Layout>
    </Box>
  );
};

export default FooterInfoSection;
