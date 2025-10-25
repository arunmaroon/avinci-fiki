"use client";
import React from "react";
import { Box, Grid, Divider } from "@mui/material";
import MvLink from "./MvLink";
import colors from "../colors";
import MvAccordion from "./Accordion";
import WebTypography from "./WebTypography";
import { getHrefValues, getPageCategory } from "../web-componentsUtility";

interface FooterContentProps {
  title: string;
  links: { title: string; href: string; newTab?: boolean }[];
  menu?: string;
  linkComponent?: React.ElementType;
  pathname: string;
}

const GenerateFooterContent: React.FC<FooterContentProps> = ({ title, links, menu = "false", pathname, linkComponent }) => {
  const pageCategory = getPageCategory(pathname);
  const ProductTitles = ["Loans", "Save", "Insure", "Track", "Pay"];

  const renderLinks = () =>
    links.map((link, index) => {
      const footerHref = ProductTitles.includes(title) ? getHrefValues(link.href, pageCategory, "footer") : link.href;
      return (
        <Grid item key={link.title + index}>
          <MvLink
            linkComponent={linkComponent}
            href={footerHref}
            overrideStyle={{
              color: colors["--grey15"],
              // marginBottom: index === links.length - 1 ? "0px" : "16px",
              marginTop: "16px",
              fontSize: { xxs: "24px", md: "30px", xl: "36px" },
              lineHeight: "20px",
              width: "fit-content",
              ":hover": {
                color: colors["--orange00"],
              },
            }}>
            <WebTypography variantType="regular" color={colors["--grey15"]}>
              {link.title}
            </WebTypography>
          </MvLink>
        </Grid>
      );
    });

  const renderTitle = () => (
    <WebTypography variantType="h3" color={colors["--white-color"]}>
      {title}
    </WebTypography>
  );

  return (
    <Box>
      {menu === "true" ? (
        <MvAccordion
          title={renderTitle()}
          overrideStyle={{
            backgroundColor: colors["--black-ash"],
          }}
          iconOverrideStyle={{
            color: colors["--white-color"],
          }}>
          {renderLinks()}
        </MvAccordion>
      ) : (
        <>
          {renderTitle()}
          {renderLinks()}
        </>
      )}

      <Divider
        sx={{
          marginBlock: "24px",
          borderColor: colors["--white-color"],
          height: "1px",
          opacity: 0.25,
        }}
      />
    </Box>
  );
};

export default GenerateFooterContent;
