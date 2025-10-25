export const commonConfig = {
  resourceBaseUrl: "https://dugtmg0pklp2w.cloudfront.net/",
};

export const commonConstants = {
  svgExtension: ".svg",
};

export default {
  commonConfig,
  commonConstants,
};

export const variantConstants = {
  BUTTONLARGE: "buttonLarge",
  BUTTONDEFAULT: "buttonDefault",
  BUTTONSMALL: "buttonSmall",
};

export const commonColorConstants = {
  inherit: "inherit",
};

export const PWA_ICONS = "pwa-icons/";

export enum IconNames {
  // Common Icons
  closeIcon = "closeIcon",
  badgeIcon = "badgeIcon",
  online = "online",
  cheque = "cheque",
  personalDetails = "personalDetails",
  ownHouse = "ownHouse",
  rentedHouse = "rentedHouse",
  employmentDetails = "employmentDetails",
  preferences = "preferences",
  successFilledGrey = "successFilledGrey",
  deleteTrash = "deleteTrash",
  bankDetails = "bankDetails", // ic-bank-re-imps
  selfieIcon = "selfieIcon", // ic-camera-orange
  zipUpload = "zipUpload", // ic-upload-zip
  zipFolder = "zipFolder",

  // Button Icons
  rightArrowContained = "rightArrowContained",

  // Slider Icons
  thumbCircleIcon = "thumbCircleIcon",
  thumbHandleIcon = "thumbHandleIcon",

  // Radio button Icons
  radioCircleIcon = "radioCircleIcon",
  radioSelectedCircleIcon = "radioSelectedCircleIcon",
  radioSelfEmployed = "radioSelfEmployed",
  radioIdCard = "radioIdCard",

  radioFlipkartIcon = "radioFlipkartIcon",

  // Chip Icon
  chipTickIcon = "chipTickIcon",

  // Snackbar Icon
  snackbarLeadingIcon = "snackbarLeadingIcon",
  snackbarErroIcon = "snackbarErroIcon",
  infoIcon = "infoIcon",
  snackbarErrorIcon = "snackbarErrorIcon", // ic-snackbar-error

  // Checkbox Icon
  checkbox = "checkbox",
  checkboxSelected = "checkboxSelected",
  checkboxIntermediate = "checkboxIntermediate",

  // AccordionAlert
  accordionChevronIcon = "accordionChevronIcon",
  accordionAlertIcon = "accordionAlertIcon",
  accordionSuccessCircledTickIcon = "accordionSuccessCircledTickIcon",
  accordionDefaultUserIcon = "accordionDefaultUserIcon",
  accordionPdfDocIcon = "accordionPdfDocIcon",

  mailIcon = "mailIcon",
  mailIconWithBackground = "mailIconWithBackground",
  documentIcon = "documentIcon",
  clockIcon = "clockIcon",
  searchIcon = "searchIcon",
  safeAndSecureIcon = "safeAndSecureIcon",
  privacyIcon = "privacyIcon",
  fileUploadIcon = "fileUploadIcon",
  fileDownloadIcon = "fileDownloadIcon",
  loaderIcon = "loaderIcon",
  pdfIcon = "pdfIcon",
  promoCodeTagIcon = "promoCodeTagIcon",
  cash = "cash",
  emiCalendar = "emiCalendar",
  moneyBag = "moneyBag",
  recurringDeposit = "recurringDeposit",
  trustmarkerIcon = "trustmarkerIcon",
  videoPlayIcon = "videoPlayIcon",

  // Card Icons
  chevronRightIcon = "chevronRightIcon",
  cardDefaultIcon = "cardDefaultIcon",

  // PlanSelector Icons
  upArrowIcon = "upArrowIcon",
  downArrowIcon = "downArrowIcon",

  // Stepper Icons
  stepperSuccess = "stepperSuccess",
  stepperOutlineIcon = "stepperOutlineIcon",
  npciIcon = "npciIcon",

  // Penny Item
  pennyItemIcon = "pennyItemIcon",
  pennyItemUserIcon = "pennyItemUserIcon",

  closeCircleIcon = "closeCircleIcon",
  lockIcon = "lockIcon",
  videoPasswordIcon = "videoPasswordIcon", // ic-video-password-tutorial

  chevronDownIcon = "chevronDownIcon",
  chevronUpIcon = "chevronUpIcon",

  showEye = "showEye",
  hideEye = "hideEye",

  minus = "minus",
  add = "add",

  tickShieldIcon = "tickShieldIcon",
  discountOfferIcon = "discountOfferIcon",

  delivery = "delivery",
  retryIcon = "retryIcon",
}

export enum TypographyVariants {
  headline1 = "headline1",
  headline2 = "headline2",
  title1 = "title1",
  title2 = "title2",
  bodyLargeLowEmphasis = "bodyLargeLowEmphasis",
  bodyLargeMediumEmphasis = "bodyLargeMediumEmphasis",
  bodyLargeHighEmphasis = "bodyLargeHighEmphasis",
  bodyLargeLink = "bodyLargeLink",
  bodyMediumLowEmphasis = "bodyMediumLowEmphasis",
  bodyMediumMediumEmphasis = "bodyMediumMediumEmphasis",
  bodyMediumHighEmphasis = "bodyMediumHighEmphasis",
  bodyMediumLink = "bodyMediumLink",
  bodySmallLowEmphasis = "bodySmallLowEmphasis",
  bodySmallHighEmphasis = "bodySmallHighEmphasis",
  bodySmallLink = "bodySmallLink",
  bodyTinyLowEmphasis = "bodyTinyLowEmphasis",
  bodyTinyMediumEmphasis = "bodyTinyMediumEmphasis",
  bodyTinyHighEmphasis = "bodyTinyHighEmphasis",
  bodyTinyLink = "bodyTinyLink",
  bannerTitle1 = "bannerTitle1",
  bannerTitle2 = "bannerTitle2",
}

export const variantMappingConstants = {
  [TypographyVariants.headline1]: "h1",
  [TypographyVariants.headline2]: "h2",
  [TypographyVariants.title1]: "h4",
  [TypographyVariants.title2]: "p",
  [TypographyVariants.bodyLargeMediumEmphasis]: "p",
  [TypographyVariants.bodyLargeLowEmphasis]: "p",
  [TypographyVariants.bodyLargeHighEmphasis]: "p",
  [TypographyVariants.bodyLargeLink]: "p",
  [TypographyVariants.bodyMediumLowEmphasis]: "p",
  [TypographyVariants.bodyMediumMediumEmphasis]: "p",
  [TypographyVariants.bodyMediumHighEmphasis]: "p",
  [TypographyVariants.bodyMediumLink]: "p",
  [TypographyVariants.bodySmallLowEmphasis]: "span",
  [TypographyVariants.bodySmallHighEmphasis]: "span",
  [TypographyVariants.bodySmallLink]: "span",
  [TypographyVariants.bodyTinyLowEmphasis]: "span",
  [TypographyVariants.bodyTinyMediumEmphasis]: "span",
  [TypographyVariants.bodyTinyHighEmphasis]: "span",
  [TypographyVariants.bodyTinyLink]: "span",
};
