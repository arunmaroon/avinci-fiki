import React from "react";
import { Box } from "@mui/material";
import { mvImgUrl } from "../web-componentsConstants";
import { MvImages } from "./MvImages";
import MvLink from "./MvLink";

const socialMediaLinks = [
  {
    href: "https://www.linkedin.com/company/money-view",
    src: `${mvImgUrl}ic-linkedin-v4.svg`,
    alt: "linkedin-icon",
    width: 17,
    height: 17,
  },
  {
    href: "https://www.instagram.com/mymoneyview/?hl=en",
    src: `${mvImgUrl}ic-instagram-v4.svg`,
    alt: "instagram-icon",
    width: 17,
    height: 17,
  },
  {
    href: "https://twitter.com/mymoneyview?lang=en",
    src: `${mvImgUrl}ic-new-twitter.svg`,
    alt: "twitter-icon",
    width: 18,
    height: 18,
  },
  {
    href: "https://www.youtube.com/channel/UCC_wzoIz8ai3m31w7wLAaQw",
    src: `${mvImgUrl}ic-youtube-v4.svg`,
    alt: "youtube-icon",
    width: 23,
    height: 17,
  },
  {
    href: "https://www.facebook.com/MoneyView.in/",
    src: `${mvImgUrl}ic-facebook-v4.svg`,
    alt: "facebook-icon",
    width: 9,
    height: 17,
  },
];

export type SocialMediaCardProps = {
  iconComponent?: React.ElementType;
  linkComponent?: React.ElementType;
};

const SocialMediaCard = (props: SocialMediaCardProps) => {
  const { iconComponent, linkComponent } = props;
  return (
    <Box
      sx={{
        gridColumn: "1 / span 3",
        paddingBlock: {
          xxs: "32px", // Padding for extra small screens
          xs: "32px", // Padding for small screens
          sm: "32px", // Padding for medium screens
          md: "32px", // Padding for large screens
          lg: "32px",
          xl: "32px",
        },
        paddingTop: {
          lg: "64px",
        },
      }}>
      <Box sx={{ display: "flex" }}>
        {socialMediaLinks.map((link, index) => (
          <MvLink key={link.alt + index} href={link.href} overrideStyle={{ marginRight: "24px" }} linkComponent={linkComponent}>
            <MvImages src={link.src} width={link.width} height={link.height} iconComponent={iconComponent} />
          </MvLink>
        ))}
      </Box>
    </Box>
  );
};

export default SocialMediaCard;
