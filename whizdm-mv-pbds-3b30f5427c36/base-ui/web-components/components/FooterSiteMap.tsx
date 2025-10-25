import { Grid, Divider } from "@mui/material";

import MvLink from "./MvLink";
import WebTypography from "./WebTypography";
import colors from "../colors";
import React from "react";
import { footerItems, FooterLang } from "../web-componentsConstants";

export type FooterSiteMapProps = {
  linkComponent?: React.ElementType;
};
const FooterSiteMap = (props: FooterSiteMapProps) => {
  const { linkComponent } = props;
  return (
    <Grid container sx={{ display: "flex", flexDirection: { xxs: "column", md: "row" }, gap: { xxs: "8px", md: "32px" } }}>
      <Grid item>
        <WebTypography variantType="extraSmall" color={colors["--grey15"]} overrideStyle={{ pr: "12px" }}>
          {FooterLang.WhizDmInovationWithCurrentYear}
        </WebTypography>
      </Grid>
      <Grid item>
        <Grid container alignItems="center">
          {footerItems.map((item, index) => (
            <Grid item key={item.title + index}>
              <Grid container>
                <MvLink
                  href={item.href}
                  linkComponent={linkComponent}
                  overrideStyle={{
                    color: colors["--grey05"],
                  }}>
                  <WebTypography variantType="extraSmall" color={colors["--grey15"]}>
                    {item.title}
                  </WebTypography>
                </MvLink>
                {index !== footerItems.length - 1 && (
                  <Divider orientation="vertical" variant="middle" flexItem sx={{ backgroundColor: "white", marginInline: "8px" }} />
                )}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default FooterSiteMap;
