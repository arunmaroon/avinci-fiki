export enum rightChipVariants {
  INCOMPLETE = "incomplete",
  IN_PROGRESS = "in progress",
  PENDING = "pending",
  RESUBMIT = "resubmit",
}

export enum cardStatusVariants {
  ACTIVE = "active",
  LOADING = "loading",
  COMPLETED = "completed",
  DISABLED = "disabled",
  ERROR = "error",
}

export enum actionConstants {
  CARD_ACTION = "CARD_ACTION",
  TOP_RIGHT_ELEMENT = "TOP_RIGHT_ELEMENT",
}

export enum topRightElementType {
  ICON = "icon",
  CHIP = "chip",
  ACTION = "action",
  COMPONENT = "component",
}

export enum avatarBckColor {}
export enum colorType {
  // Avatar background color
  loadingAvatarBckColor = "loadingAvatarBckColor",
  completedAvatarBckColor = "completedAvatarBckColor",
  disabledAvatarBckColor = "disabledAvatarBckColor",
  errorAvatarBckColor = "errorAvatarBckColor",

  // Avatar border
  loadingBorderColor = "loadingBorderColor",
  completedBorderColor = "completedBorderColor",
  disabledBorderColor = "disabledBorderColor",
  errorBorderColor = "errorBorderColor",

  // Chip background Color
  incompleteChipBckColor = "incompleteChipBckColor",
  progressChipBckColor = "progressChipBckColor",
  resubmitChipBckColor = "resubmitChipBckColor",

  // Chip Text Color
  incompleteChipTextColor = "incompleteChipTextColor",
  progressChipTextColor = "progressChipTextColor",
  resubmitChipTextColor = "resubmitChipTextColor",
}

export type IconConfig = {
  type: topRightElementType.ICON;
  iconConfig: {
    icon: string;
  };
};

export type ChipConfig = {
  type: topRightElementType.CHIP;
  chipConfig: {
    label: string;
  };
};

export type ActionConfig = {
  type: topRightElementType.ACTION;
  actionConfig: {
    key: string;
    label: string;
  };
};

export type ComponentConfig = {
  type: topRightElementType.COMPONENT;
  node: React.ReactNode;
};

export type CardStatus = "active" | "completed" | "disabled" | "error" | "loading" | string;

export type TopRightElementConfig = IconConfig | ChipConfig | ActionConfig | ComponentConfig | null;
