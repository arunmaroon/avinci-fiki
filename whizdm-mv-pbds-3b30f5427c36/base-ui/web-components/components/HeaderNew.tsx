import React, { useState, useRef, useEffect } from "react";
import { AppBar, Toolbar, Menu, Box, Grid } from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import MvButton from "./MvButton";
import NavCell from "./NavCell";
import colors from "../colors";
import { getHrefValues, getPageCategory } from "../web-componentsUtility";
import { mvIcons, Link, SidebarSection } from "../web-componentsConstants";

import MvLink from "./MvLink";
import WebTypography from "./WebTypography";

type NavbarProps = {
  navbarData: SidebarSection[];
  pathname?: string;
  linkComponent?: React.ElementType;
  iconComponent?: React.ElementType;
};

const Navbar: React.FC<NavbarProps> = (props) => {
  const { navbarData, pathname = "", linkComponent, iconComponent } = props;
  let pageCategory = getPageCategory(pathname);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, menuTitle: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setAnchorEl(event.currentTarget);
    setOpenMenu(menuTitle);
  };

  const handleCloseMenu = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setAnchorEl(null);
      setOpenMenu(null);
    }, 100);
  };

  const cancelCloseMenu = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getGridItemSize = (linkCount: number) => {
    if (linkCount <= 2) return 12;
    if (linkCount === 3 || linkCount === 4) return 6;
    if (linkCount >= 7) return 3;
    return 4;
  };

  const NavBarButtonStyle = {
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "#0000000D",
      color: colors["--primary-color"],
    },
    borderRadius: "4px",
    p: 0,
    px: "16px",
    py: "8px",
  };
  let contactUsContants = { title: "Contact Us", icon: mvIcons.ContactUs, href: "/contact-us" };

  return (
    <AppBar position="static" sx={{ background: "transparent", color: "black", boxShadow: "none" }}>
      <Toolbar sx={{ justifyContent: "space-between", paddingRight: "0px !important" }}>
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: "8px" }}>
          {navbarData.map((item: SidebarSection, idx: number) => (
            <div key={idx} onMouseEnter={(event) => handleOpenMenu(event, item.title)} onMouseLeave={(event) => handleCloseMenu()}>
              <MvButton
                aria-controls={openMenu === item.title ? "menu-appbar" : undefined}
                aria-haspopup="true"
                sx={{
                  ...NavBarButtonStyle,
                  backgroundColor: openMenu === item.title ? "#0000000D" : "transparent",
                }}>
                <WebTypography overrideStyle={{ color: openMenu === item.title ? colors["--primary-color"] : colors["--black02"] }}>
                  {item.title}
                </WebTypography>
                {item.links.length > 0 && (
                  <ExpandMoreRoundedIcon
                    sx={{
                      color: openMenu === item.title ? colors["--primary-color"] : colors["--black02"],
                      transform: openMenu === item.title ? "rotate(180deg)" : "rotate(0deg)",
                      marginLeft: "4px",
                      verticalAlign: "middle",
                      transition: "transform 0.3s ease-in-out",
                      width: "24px",
                      height: "24px",
                    }}
                  />
                )}
              </MvButton>

              {item.links.length > 0 && (
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  open={openMenu === item.title}
                  onClose={handleCloseMenu}
                  MenuListProps={{
                    onMouseEnter: cancelCloseMenu,
                    onMouseLeave: handleCloseMenu,
                  }}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  sx={{
                    "& .MuiBackdrop-root": {
                      top: "50px",
                    },
                    "&.MuiMenu-root": {
                      top: "50px",
                    },
                  }}
                  PaperProps={{
                    sx: {
                      "&& .MuiMenu-list": {
                        padding: "0px",
                      },
                      width: "auto",
                      padding: 0,
                      borderRadius: 2,
                      "&.MuiPaper-root": {
                        top: "30px !important",
                      },
                    },
                  }}>
                  <Grid
                    container
                    spacing={"12px"}
                    sx={{
                      width: {
                        xs: "100%",
                        sm: item.links.length <= 2 ? "auto" : "100%",
                        md: item.links.length <= 3 ? "auto" : "100%",
                        lg: "auto",
                      },
                      maxWidth: {
                        xs: "100%",
                        sm: item.links.length <= 2 ? "400px" : "600px",
                        md: item.links.length <= 3 ? "600px" : "800px",
                        lg: item.links.length >= 7 && item.title !== "Calculators" ? "1102px" : "868px",
                      },
                      margin: "auto",
                      backgroundColor: colors["--grey01"],
                      paddingBottom: "12px",
                      paddingRight: "12px",
                      flexDirection: item.links.length === 2 ? "column" : "row",
                    }}>
                    {item.links.map((link: Link, i: number) => (
                      <Grid item xs={12} sm={getGridItemSize(item.links.length)} key={i}>
                        <Box
                          sx={{
                            height: "100%",
                            borderRadius: "4px",
                            background: colors["--white-color"],
                            "&:hover": {
                              boxShadow: "0px 2px 8px 0px rgba(16, 16, 18, 0.08)",
                            },
                            minWidth: item.links.length <= 2 ? "260px" : "auto",
                            width: "100%",
                            display: "flex",
                            // minWidth: link.icon ? "260px" : "200px",//discussion requred
                          }}>
                          <NavCell
                            title={link.title}
                            description={link.description}
                            icon={link.icon}
                            redirectionUrl={link.redirection}
                            pageCategory={pageCategory}
                            linkComponent={linkComponent}
                            iconComponent={iconComponent}
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Menu>
              )}
            </div>
          ))}
          <MvLink
            href={pageCategory ? getHrefValues(contactUsContants.href, pageCategory, "header") : contactUsContants.href}
            overrideStyle={{ ...NavBarButtonStyle }}>
            <WebTypography color={colors["--black02"]}>{contactUsContants.title}</WebTypography>
          </MvLink>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
