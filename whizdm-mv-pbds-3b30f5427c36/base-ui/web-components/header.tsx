import React, { Component, useEffect, useState } from "react";
import { Box, Grid, IconButton, ThemeProvider } from "@mui/material";

import Sidebar from "./components/SideNavBar";
import Navbar from "./components/HeaderNew";
import MvLink from "./components/MvLink";
import colors, { navbarColor } from "./colors";
import { mvIcons } from "./web-componentsConstants";
import { MvImages } from "./components/MvImages";
import { getSideBarData } from "./web-componentsUtility";
import { useStyles } from "./styles/headerStyles";
import theme from "./theme";
import "./styles.css";

export type HeaderProps = {
  disableAppComponents?: boolean;
  pathname: string;
  linkComponent?: React.ElementType;
  iconComponent?: React.ElementType;
  mvSiteUrl?: string;
  crossSellUrl?: string;
  fdRate?: string;
};

export type Link = {
  title: string;
  description?: string;
  redirection: string;
  icon?: string;
};

export function Header(props: HeaderProps) {
  const { disableAppComponents, pathname, linkComponent, mvSiteUrl = "", crossSellUrl = "", fdRate = "", iconComponent } = props;
  const { classes } = useStyles();

  const logoHref = disableAppComponents ? "#" : "/";

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | boolean>(false);
  const [navbarBgColor, setNavbarBgColor] = useState<string>(navbarColor[pathname ?? ""] || colors["--white-color"]);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const pageCategory = pathname ?? ""; // Use the current route as the category
      const bgColor = navbarColor[pageCategory] || colors["--white-color"];
      console.log("bgcolor: ", bgColor);
      if (entries[0].isIntersecting) {
        setNavbarBgColor(bgColor);
      } else {
        setNavbarBgColor(colors["--white-color"]);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, { threshold: [0] });
    const firstSection = document.querySelector(".firstSection"); // product page first section

    if (firstSection) {
      observer.observe(firstSection);
    } else {
      setNavbarBgColor(colors["--white-color"]); //SEO pages
    }

    return () => {
      if (firstSection) {
        observer.unobserve(firstSection);
      }
    };
  }, [pathname]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          marginBottom: { xl: "80px", md: pathname !== "/" ? "64px" : "", xs: pathname !== "/" ? "56px" : "" },
        }}>
        <Grid
          component="header"
          container
          direction="row"
          sx={{
            background: navbarBgColor,
            position: { xl: "fixed", xs: pathname !== "/" ? "fixed" : "static" },
            top: 0,
            backgroundColor: colors["--white-color"],
            zIndex: 1000,

            justifyContent: "center",
            alignItems: "center",
            paddingInline: { xl: "94px", md: "24px", xs: "16px" },
            paddingBlock: { xl: "8px", md: "16px", xs: "12px" },
            width: "100%",
          }}>
          <Grid
            item
            sx={{
              width: "1732px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginRight: { xl: "-16px" },
            }}>
            {/* Logo */}
            <Box display="flex" alignItems="center">
              <MvLink href={logoHref}>
                <MvImages src={`${mvIcons.MvGreenLogo}`} iconComponent={iconComponent} className={classes.headerLogoClass} />
              </MvLink>
            </Box>

            <Grid item sx={{ display: { xl: "block", xs: "none" } }}>
              <Navbar
                navbarData={getSideBarData(mvSiteUrl, crossSellUrl, fdRate)}
                pathname={pathname}
                linkComponent={linkComponent}
                iconComponent={iconComponent}
              />
            </Grid>

            {/* Hamburger Side bar */}
            {!disableAppComponents && (
              <Grid item sx={{ display: { xl: "none", xs: "block" } }}>
                {/* Button to open sidebar */}
                <IconButton onClick={toggleDrawer} sx={{ p: 0 }}>
                  <MvImages src={`${mvIcons.HamburgerMenuIcon}`} width={24} height={24} iconComponent={iconComponent} />
                </IconButton>
                <Sidebar
                  toggleDrawer={toggleDrawer}
                  drawerOpen={drawerOpen}
                  expanded={expanded}
                  setExpanded={setExpanded}
                  sidebarData={getSideBarData(mvSiteUrl, crossSellUrl, fdRate)}
                  pathname={pathname}
                  linkComponent={linkComponent}
                  iconComponent={iconComponent}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

const NavButton = ({ children }: { children: React.ReactElement | string }) => (
  <Box
    sx={{
      color: "#333",
      "&:hover": {
        backgroundColor: "transparent",
        color: "#00a86b",
      },
    }}>
    {children}
  </Box>
);

const menuItems = [
  { label: "Loans", items: ["Personal Loan", "Home Loan", "Car Loan"] },
  { label: "Invest", items: ["Stocks", "Mutual Funds", "Fixed Deposits"] },
  { label: "Insure", items: ["Life Insurance", "Health Insurance", "Car Insurance"] },
  { label: "Track", items: ["Expenses", "Investments", "Goals"] },
  { label: "Pay", items: ["Bills", "Transfers", "Recharge"] },
  { label: "Calculators", items: ["EMI Calculator", "SIP Calculator", "Tax Calculator"] },
];
