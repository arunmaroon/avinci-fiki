import React from "react";
import { Box, Grid, ThemeProvider } from "@mui/material";

import colors from "./colors";
import WebTypography, { WebTypographyVariants, fontWeightVariants } from "./components/WebTypography";
import FooterSiteMap from "./components/FooterSiteMap";
import Layout from "./components/NewLayout";
import SocialMediaCard from "./components/SocialMediaCard";
import theme from "./theme";
import ConditionalFooterItems from "./components/ConditionalFooterItems";
import GenerateFooterContent from "./components/GenerateFooterContent";
import { getFooterModel } from "./web-componentsUtility";
import { FooterLang } from "./web-componentsConstants";
import "./styles.css";

export type FooterSectionProps = {
  iconComponent?: React.ElementType;
  linkComponent?: React.ElementType;
  pathname: string;
  mvSiteUrl?: string;
  crossSellUrl?: string;
};
export const FooterSection = (props: FooterSectionProps) => {
  const { iconComponent, linkComponent, pathname, mvSiteUrl = "", crossSellUrl = "" } = props;
  const FooterModel = getFooterModel(mvSiteUrl, crossSellUrl);
  return (
    <ThemeProvider theme={theme}>
      <footer>
        <Box
          sx={{
            backgroundColor: colors["--black-ash"],
            color: colors["--white-color"],
            paddingBlock: { xl: "80px", md: "40px", xxs: "32px" },
            paddingInline: "0px",
          }}>
          <Layout>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xxs: "column", md: "row" },
                justifyContent: "space-between",
              }}>
              {/* For Desktop */}
              <Box
                sx={{
                  display: { xxs: "none", xl: "flex" },
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  gap: "64px",
                }}>
                <Box sx={{ flex: "1 1 33.33%" }}>
                  <GenerateFooterContent
                    pathname={pathname}
                    linkComponent={linkComponent}
                    title="The Company"
                    links={FooterModel["THE COMPANY"]}
                  />
                  <GenerateFooterContent pathname={pathname} linkComponent={linkComponent} title="Loans" links={FooterModel["LOANS"]} />
                  <GenerateFooterContent pathname={pathname} linkComponent={linkComponent} title="Save" links={FooterModel["SAVE"]} />
                </Box>

                <Box sx={{ flex: "1 1 33.33%" }}>
                  <GenerateFooterContent pathname={pathname} linkComponent={linkComponent} title="Insure" links={FooterModel["INSURE"]} />
                  <GenerateFooterContent pathname={pathname} linkComponent={linkComponent} title="Track" links={FooterModel["TRACK"]} />
                  {/* <GenerateFooterContent pathname={pathname} linkComponent={linkComponent} title="Pay" links={FooterModel["PAY"]} /> */}
                  <GenerateFooterContent
                    pathname={pathname}
                    linkComponent={linkComponent}
                    title="Partners"
                    links={FooterModel["PARTNERS"]}
                  />
                </Box>

                <Box sx={{ flex: "1 1 33.33%" }}>
                  <GenerateFooterContent
                    pathname={pathname}
                    linkComponent={linkComponent}
                    title="Resources"
                    links={FooterModel["RESOURCES"]}
                  />
                  <GenerateFooterContent
                    pathname={pathname}
                    linkComponent={linkComponent}
                    title="Grievance Redressal"
                    links={FooterModel["GRIEVANCE REDRESSAL"]}
                  />
                  <GenerateFooterContent
                    pathname={pathname}
                    linkComponent={linkComponent}
                    title="Contact Us"
                    links={FooterModel["CONTACT US"]}
                  />
                </Box>
              </Box>

              {/* For Tablet */}
              <Box
                sx={{
                  display: { xxs: "none", md: "flex", xl: "none" },
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  gap: "64px",
                }}>
                <Box sx={{ flex: "1 1 50%" }}>
                  <GenerateFooterContent
                    pathname={pathname}
                    linkComponent={linkComponent}
                    title="The Company"
                    links={FooterModel["THE COMPANY"]}
                  />
                  <GenerateFooterContent pathname={pathname} linkComponent={linkComponent} title="Loans" links={FooterModel["LOANS"]} />
                  <GenerateFooterContent pathname={pathname} linkComponent={linkComponent} title="Save" links={FooterModel["SAVE"]} />
                  <GenerateFooterContent pathname={pathname} linkComponent={linkComponent} title="Insure" links={FooterModel["INSURE"]} />
                  <GenerateFooterContent pathname={pathname} linkComponent={linkComponent} title="Track" links={FooterModel["TRACK"]} />
                </Box>

                <Box sx={{ flex: "1 1 50%" }}>
                  {/* <GenerateFooterContent pathname={pathname} linkComponent={linkComponent} title="Pay" links={FooterModel["PAY"]} /> */}
                  <GenerateFooterContent
                    pathname={pathname}
                    linkComponent={linkComponent}
                    title="Partners"
                    links={FooterModel["PARTNERS"]}
                  />
                  <GenerateFooterContent
                    pathname={pathname}
                    linkComponent={linkComponent}
                    title="Resources"
                    links={FooterModel["RESOURCES"]}
                  />
                  <GenerateFooterContent
                    pathname={pathname}
                    linkComponent={linkComponent}
                    title="Grievance Redressal"
                    links={FooterModel["GRIEVANCE REDRESSAL"]}
                  />
                  <GenerateFooterContent
                    pathname={pathname}
                    linkComponent={linkComponent}
                    title="Contact Us"
                    links={FooterModel["CONTACT US"]}
                  />
                </Box>
              </Box>

              {/* For Mobile */}
              <Box
                sx={{
                  display: { xxs: "flex", md: "none" },
                  flexDirection: "column",
                }}>
                <GenerateFooterContent
                  pathname={pathname}
                  linkComponent={linkComponent}
                  title="The Company"
                  links={FooterModel["THE COMPANY"]}
                  menu="true"
                />
                <GenerateFooterContent
                  pathname={pathname}
                  linkComponent={linkComponent}
                  title="Loans"
                  links={FooterModel["LOANS"]}
                  menu="true"
                />
                <GenerateFooterContent
                  pathname={pathname}
                  linkComponent={linkComponent}
                  title="Save"
                  links={FooterModel["SAVE"]}
                  menu="true"
                />
                <GenerateFooterContent
                  pathname={pathname}
                  linkComponent={linkComponent}
                  title="Insure"
                  links={FooterModel["INSURE"]}
                  menu="true"
                />
                <GenerateFooterContent
                  pathname={pathname}
                  linkComponent={linkComponent}
                  title="Track"
                  links={FooterModel["TRACK"]}
                  menu="true"
                />
                {/* <GenerateFooterContent pathname={pathname} linkComponent={linkComponent} title="Pay" links={FooterModel["PAY"]} menu="true" /> */}
                <GenerateFooterContent
                  pathname={pathname}
                  linkComponent={linkComponent}
                  title="Partners"
                  links={FooterModel["PARTNERS"]}
                  menu="true"
                />
                <GenerateFooterContent
                  pathname={pathname}
                  linkComponent={linkComponent}
                  title="Resources"
                  links={FooterModel["RESOURCES"]}
                  menu="true"
                />
                <GenerateFooterContent
                  pathname={pathname}
                  linkComponent={linkComponent}
                  title="Grievance Redressal"
                  links={FooterModel["GRIEVANCE REDRESSAL"]}
                  menu="true"
                />
                <GenerateFooterContent
                  pathname={pathname}
                  linkComponent={linkComponent}
                  title="Contact Us"
                  links={FooterModel["CONTACT US"]}
                  menu="true"
                />
              </Box>
            </Box>

            {/* Shared Elements */}
            <SocialMediaCard iconComponent={iconComponent} linkComponent={linkComponent} />
            <FooterSiteMap linkComponent={linkComponent} />
            <Grid container sx={{ paddingTop: "16px" }}>
            <Grid item>
              <WebTypography
                variantType={WebTypographyVariants.extraSmall}
                weight={fontWeightVariants.bold}
                color={colors['--grey15']}
                dangerouslySetInnerHTML={{ __html: FooterLang.FooterComplianceText }}
              />
            </Grid>
          </Grid>
          </Layout>
        </Box>

        {/* Client component wrapper to conditionally render content based on Nextjs pathname */}
        <ConditionalFooterItems pathname={pathname} />
      </footer>
    </ThemeProvider>
  );
};
