import React, { Component } from "react";

import { Box, Grid } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import colors from "../colors";
import WebTypography, { WebTypographyVariants } from "./WebTypography";
import { getHrefValues, getCampaignClass } from "../web-componentsUtility";
import MvLink from "./MvLink";
import { MvImages } from "./MvImages";
import { mvImgUrl } from "../web-componentsConstants";

export type NavCellProps = {
  icon?: string;
  title: string;
  description?: string;
  redirectionUrl: string;
  pageCategory: string;
  linkComponent?: React.ElementType;
  iconComponent?: React.ElementType;
};

const NavCell = (props: NavCellProps) => {
  const { icon, title, description, redirectionUrl, pageCategory, linkComponent, iconComponent } = props;
  console.log(props);
  return (
    <MvLink
      className={getCampaignClass(redirectionUrl, pageCategory, "header")}
      href={pageCategory ? getHrefValues(redirectionUrl, pageCategory, "header") : redirectionUrl}
      // newTab
      linkComponent={linkComponent}
      overrideStyle={{ textDecoration: "none", width: "100%", display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          p: icon ? "12px 12px 16px 12px" : "12px 16px 14px 16px",
          width: "100%",
          // minWidth: icon ? "260px" : "auto"
        }}>
        <Grid
          container
          sx={{
            alignItems: "center",
            flexWrap: "nowrap", // check with design .. currently we don't need this since below 1280 we are showing hamburger icon

            position: "relative",
            "&:hover .arrow-icon": {
              transform: "translateX(10px)",
              opacity: 1,
              height: "100%",
            },
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "transparent",
              marginRight: "auto",
              width: "30%", //check width issue
              // width: "40px",
              opacity: 0,
              background: "linear-gradient(90deg, rgba(255, 255, 255, 0.00) 0%, #FFF 46.87%)",
            },
            "&:hover::before": {
              opacity: 1,
            },
          }}>
          {/* Icon */}
          {icon && (
            <Grid item sx={{ mr: "12px" }}>
              <MvImages width={24} height={24} src={`${mvImgUrl}${icon}`} iconComponent={iconComponent}></MvImages>
            </Grid>
          )}

          {/* Main content */}
          <Grid item>
            <WebTypography>{title}</WebTypography>
            {description ? (
              <WebTypography variantType={WebTypographyVariants.extraSmall} color={colors["--grey14"]}>
                {description}
              </WebTypography>
            ) : null}
          </Grid>

          {/* Right arrow icon */}
          <ArrowForwardIcon
            className="arrow-icon"
            sx={{
              position: "absolute",
              right: 10,
              transform: "translateX(0)",
              transition: "transform 300ms linear, opacity 300ms",
              opacity: 0,
              width: "16px",
              color: colors["--green07"],

              // fix for minWidth -> grid of three columns
              // marginRight: "10px",
            }}
          />
        </Grid>
      </Box>
    </MvLink>
  );
};

export default NavCell;
