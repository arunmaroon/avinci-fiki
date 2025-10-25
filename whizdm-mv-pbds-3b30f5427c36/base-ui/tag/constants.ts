export enum tagType {
  DEFAULT = "default",
  TAG_RECOMMENDED = "tagRecommended",
  TAG_CREDIT_SCORE = "tagCreditScore",
  TAG_APPLICATION_STATUS = "tagApplicationStatus",
  TAG_TICKETING_STATUS = "tagTicketingStatus",
}

export enum defaultTagVariant {
  DARK = "dark",
  LIGHT = "light",
  GRADIENT = "gradient",
}

export enum defaultTagDarkSubVariant {
  PRIMARY = "primary",
  SECONDARY = "secondary",
}

export enum tagRecommendedVariant {
  GREEN = "green",
  RED = "red",
}

export enum tagCreditScoreVariant {
  EXCELLENT = "excellent",
  VERY_GOOD = "verygood",
  GOOD = "good",
  FAIR = "fair",
  POOR = "poor",
}

export enum tagApplicationStatusVariant {
  INCOMPLETE = "incomplete",
  IN_PROGRESS = "inprogress",
  RESUBMIT = "resubmit",
  PENDING = "pending",
  FAILED = "failed",
}

export enum tagTicketingStatusVariant {
  IN_PROGRESS = "inprogress",
  PENDING = "pending",
  RESOLVED = "resolved",
  CLOSED = "closed",
}

export const tagRecommended = {
  [tagRecommendedVariant.GREEN]: {
    label: "Recommended",
    className: "gradientgreen",
  },
  [tagRecommendedVariant.RED]: {
    label: "Recommended",
    className: "gradientred",
  },
};

export const tagCreditScore = {
  [tagCreditScoreVariant.EXCELLENT]: {
    label: "Excellent",
    className: "darkprimarygreen",
  },
  [tagCreditScoreVariant.VERY_GOOD]: {
    label: "Very good",
    className: "darksecondarygreen",
  },
  [tagCreditScoreVariant.GOOD]: {
    label: "Good",
    className: "darkprimaryyellow",
  },
  [tagCreditScoreVariant.FAIR]: {
    label: "Fair",
    className: "darkprimaryorange",
  },
  [tagCreditScoreVariant.POOR]: {
    label: "Poor",
    className: "darkprimaryred",
  },
};

export const tagApplicationStatus = {
  [tagApplicationStatusVariant.INCOMPLETE]: {
    label: "Incomplete",
    className: "lightyellow",
  },
  [tagApplicationStatusVariant.IN_PROGRESS]: {
    label: "In progress",
    className: "lightorange",
  },
  [tagApplicationStatusVariant.RESUBMIT]: {
    label: "Resubmit",
    className: "lightred",
  },
  [tagApplicationStatusVariant.PENDING]: {
    label: "Pending",
    className: "lightred",
  },
  [tagApplicationStatusVariant.FAILED]: {
    label: "Failed",
    className: "lightred",
  },
};

export const tagTicketingStatus = {
  [tagTicketingStatusVariant.IN_PROGRESS]: {
    label: "In progress",
    className: "lightorange",
  },
  [tagTicketingStatusVariant.PENDING]: {
    label: "Pending",
    className: "lightblue",
  },
  [tagTicketingStatusVariant.RESOLVED]: {
    label: "Resolved",
    className: "lightgreen",
  },
  [tagTicketingStatusVariant.CLOSED]: {
    label: "Closed",
    className: "lightgrey",
  },
};
