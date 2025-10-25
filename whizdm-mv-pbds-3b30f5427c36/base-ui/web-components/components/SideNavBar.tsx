import React, { useState } from "react";
import { Drawer, List, ListItem, IconButton, Typography, Box, Divider, Grid } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MvAccordion from "./Accordion";
import NavCell from "./NavCell";
import colors from "../colors";
import { Link, SidebarSection, mvIcons, mvImgUrl } from "../web-componentsConstants";
import MvLink from "./MvLink";
import WebTypography, { WebTypographyVariants } from "./WebTypography";
import { getHrefValues, getPageCategory } from "../web-componentsUtility";
import { MvImages } from "./MvImages";

// Type for the props
interface SidebarProps {
  toggleDrawer: () => void;
  drawerOpen: boolean;
  expanded: string | boolean;
  setExpanded: React.Dispatch<React.SetStateAction<string | boolean>>;
  sidebarData: SidebarSection[];
  pathname?: string;
  linkComponent?: React.ElementType;
  iconComponent?: React.ElementType;
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const { toggleDrawer, drawerOpen, expanded, setExpanded, sidebarData, pathname = "", linkComponent, iconComponent } = props;
  let pageCategory = getPageCategory(pathname);

  const handleAccordionToggle = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };
  let contactUsContants = { title: "Contact Us", icon: mvIcons.ContactUs, href: "/contact-us" };
  return (
    <Box>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          display: { xs: "block", xl: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 292, px: "16px", py: "24px", backgroundColor: colors["--grey01"] },
        }}>
        <Box>
          <IconButton onClick={toggleDrawer} sx={{ display: "flex", m: 0, p: 0, ml: "auto" }}>
            <CloseIcon sx={{ color: "black", width: "24px" }} />
          </IconButton>

          <List sx={{ paddingBottom: "24px" }}>
            {sidebarData?.map((section: SidebarSection, idx: number) => (
              <React.Fragment key={`section-${idx}`}>
                <MvAccordion
                  expanded={expanded === section.title}
                  onChange={handleAccordionToggle(section.title)}
                  overrideStyle={{
                    boxShadow: "none",
                    "& .MuiAccordionSummary-root": {
                      padding: "0px",
                      "& .MuiSvgIcon-root": {
                        width: "32px",
                        height: "32px",
                      },
                    },
                    "&.Mui-expanded": {
                      marginTop: "0px",
                    },
                    "& .MuiAccordionDetails-root": {
                      padding: "0px",
                    },
                    backgroundColor: colors["--grey01"],
                  }}
                  title={
                    <ListItem
                      sx={{
                        display: "flex",
                        alignItems: "center", // Align icon, title, and chevron in a row and vertically centered
                        p: 0,
                        py: "16px",
                        paddingBottom: "16px",
                      }}>
                      <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>
                        <MvImages src={`${mvImgUrl}${section.icon}`} width={32} height={32} iconComponent={iconComponent} />
                      </Box>
                      <WebTypography variantType={WebTypographyVariants.h6}>{section.title}</WebTypography>
                    </ListItem>
                  }>
                  {section.links.map((link: Link, index: number) => (
                    <ListItem
                      key={`${section.title}-link-${index}`}
                      sx={{
                        p: 0,
                        backgroundColor: colors["--white-color"],
                        marginBottom: idx === sidebarData.length - 1 || index !== section.links.length - 1 ? "16px" : "",
                        borderRadius: "4px",
                      }}>
                      <NavCell
                        title={link.title}
                        description={link.description}
                        icon={link.icon}
                        redirectionUrl={link.redirection}
                        pageCategory={pageCategory}
                        linkComponent={linkComponent}
                      />
                    </ListItem>
                  ))}
                </MvAccordion>
                <Divider />
              </React.Fragment>
            ))}
            {/* Contact Us */}
            <ListItem sx={{ p: 0, py: "16px" }}>
              <MvLink
                href={pageCategory ? getHrefValues(contactUsContants.href, pageCategory, "header") : contactUsContants.href}
                overrideStyle={{ display: "flex", alignItems: "center", width: "100%" }}>
                <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>
                  <MvImages src={contactUsContants.icon} width={32} height={32} iconComponent={iconComponent} />
                </Box>
                <WebTypography variantType={WebTypographyVariants.h6}>{contactUsContants.title}</WebTypography>
              </MvLink>
            </ListItem>
            <Divider />
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
