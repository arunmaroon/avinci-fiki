import { IconNames } from "@mvloans/base-ui.common";

export const lang = {
  SAFE_AND_SECURE: "Safe and secure",
  PRIVACY: "Privacy",
  // COPY_RIGHT_TEXT: "© {year} WhizDM Innovations Pvt. Ltd.",
  COPY_RIGHT_TEXT: `© ${new Date().getFullYear().toString()} WhizDM Innovations Pvt. Ltd.`,
};

export const IconsFooter = {
  IC_SAFE: IconNames.safeAndSecureIcon,
  IC_PRIVACY: IconNames.privacyIcon,
};

export const FooterModel = [
  { icon: IconsFooter.IC_SAFE, text: lang.SAFE_AND_SECURE },
  { icon: IconsFooter.IC_PRIVACY, text: lang.PRIVACY },
];
