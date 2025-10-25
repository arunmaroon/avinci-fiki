import React, { ReactNode } from "react";
import { Avatar, Card as MuiCard, CircularProgress, Grid } from "@mui/material";

import Typography from "@mvloans/base-ui.typography";
import { Chip } from "@mvloans/base-ui.chip";
import Button, { ButtonProps } from "@mvloans/base-ui.button";
import { TypographyVariants } from "@mvloans/base-ui.common";
import { MVTheme } from "@mvloans/base-ui.theme-provider";
import { MvSvgIcon } from "@mvloans/base-ui.mv-svg-icon";

import {
  CardStatus,
  TopRightElementConfig,
  rightChipVariants,
  cardStatusVariants,
  actionConstants,
  topRightElementType,
  colorType,
} from "./constants";
import { useStyles } from "./styles";

export interface ConfigObject {
  // The title of the card
  title: string | ReactNode;

  // The description of the card
  description?: string | ReactNode;

  // Which state the card is in (active, completed, disabled, error, loading)
  cardStatus: CardStatus;

  // top right element
  topRightElement?: TopRightElementConfig;

  // Footer that displays a string as well as a react node
  footer?: string | ReactNode;

  // The action button/link
  cardAction?: ButtonProps[] | null;

  // An avatar that displays the number of the card or an icon
  avatar?: string | number;

  // Hide the entire card
  shouldHide?: boolean;
}

export type ConfigCardProps = {
  /**
   * a node to be rendered in the special component.
   */
  children?: ReactNode;
  /**
   * Config to be passed to each card.
   */
  config: ConfigObject;
  /**
   * Additional classes to override.
   */
  classes?: ConfigCardClasses;
  /**
   * The onclick for the button.
   */
  onClick?: (id: string | undefined, target: actionConstants.CARD_ACTION | actionConstants.TOP_RIGHT_ELEMENT) => {} | void;
  /**
   * id for testing
   */
  id: string;
};

export interface ConfigCardClasses {
  card?: string;
  avatar?: string;
  title?: string;
  topRightElement?: string;
  chip?: string;
  chipTypography?: string;
  description?: string;
  children?: string;
  footer?: string;
  cardAction?: string;
  cardActionContainer?: string;
}

const getCardColors = (cardStatus: string, theme: MVTheme) => {
  const { semColors, borderWidth } = theme.tokens;
  let avatarBckColor = "";
  let avatarTextColor = "";
  let titleColor = "";
  let descriptionColor = "";
  let borderColor = "";
  switch (cardStatus.toLowerCase()) {
    case cardStatusVariants.ACTIVE:
    case cardStatusVariants.LOADING:
      avatarBckColor = colorType.loadingAvatarBckColor;
      avatarTextColor = semColors.neutral.text.highEmphasisInverse;
      titleColor = semColors.neutral.text.mediumEmphasis;
      descriptionColor = semColors.neutral.text.mediumEmphasis;
      borderColor = colorType.loadingBorderColor;
      break;
    case cardStatusVariants.COMPLETED:
      avatarBckColor = colorType.completedAvatarBckColor;
      avatarTextColor = semColors.neutral.text.mediumEmphasis;
      titleColor = semColors.neutral.text.mediumEmphasis;
      descriptionColor = semColors.neutral.text.lowEmphasis;
      borderColor = colorType.completedBorderColor;
      break;
    case cardStatusVariants.DISABLED:
      avatarBckColor = colorType.disabledAvatarBckColor;
      avatarTextColor = semColors.neutral.text.lowEmphasis;
      titleColor = semColors.neutral.text.lowEmphasis;
      descriptionColor = semColors.neutral.text.lowEmphasis;
      borderColor = colorType.disabledBorderColor;
      break;
    case cardStatusVariants.ERROR:
      avatarBckColor = colorType.errorAvatarBckColor;
      avatarTextColor = semColors.neutral.text.highEmphasisInverse;
      titleColor = semColors.neutral.text.mediumEmphasis;
      descriptionColor = semColors.neutral.text.mediumEmphasis;
      borderColor = colorType.errorBorderColor;
      break;
  }
  return { avatarBckColor, avatarTextColor, titleColor, descriptionColor, borderColor };
};

const getChipColor = (topRightElement?: TopRightElementConfig) => {
  const chipText = topRightElement?.type === topRightElementType.CHIP ? topRightElement.chipConfig.label : "";
  let chipBackgroundColor = "";
  let chipTextColor = "";
  switch (chipText?.toLowerCase()) {
    case rightChipVariants.INCOMPLETE:
      chipBackgroundColor = colorType.incompleteChipBckColor;
      chipTextColor = colorType.incompleteChipTextColor;
      break;
    case rightChipVariants.IN_PROGRESS:
      chipBackgroundColor = colorType.progressChipBckColor;
      chipTextColor = colorType.progressChipTextColor;
      break;
    case rightChipVariants.PENDING:
    case rightChipVariants.RESUBMIT:
      chipBackgroundColor = colorType.resubmitChipBckColor;
      chipTextColor = colorType.resubmitChipTextColor;
      break;
  }
  return { chipBackgroundColor, chipTextColor };
};

type StatusAvatarProps = {
  avatarTextColor: string;
  avatarBckColor: string;
  config: ConfigObject;
  propsClasses: ConfigCardClasses;
};

const getTitleTypographyVariant = (cardStatus: string) => {
  return cardStatus === cardStatusVariants.ACTIVE || cardStatus === cardStatusVariants.LOADING || cardStatus === cardStatusVariants.ERROR
    ? TypographyVariants.bodyMediumHighEmphasis
    : TypographyVariants.bodyMediumLowEmphasis;
};

const StatusAvatar = (props: StatusAvatarProps) => {
  const { classes, cx } = useStyles();
  const { config, avatarTextColor, avatarBckColor, propsClasses } = props;
  if (typeof config.avatar === "string") {
    return <MvSvgIcon name={config.avatar} />;
  } else {
    return (
      <Avatar className={cx(classes.avatar, classes[avatarBckColor], propsClasses.avatar)}>
        <Typography variant={TypographyVariants.bodySmallHighEmphasis} colorValue={avatarTextColor}>
          {config.avatar}
        </Typography>
      </Avatar>
    );
  }
};

export function ConfigCard(props: ConfigCardProps) {
  const { children, config, onClick = () => {}, id, classes: propsClasses = {} } = props;
  const { title, description, cardAction } = config;
  const { classes, cx, theme } = useStyles();
  const { semColors, spacing, sizing } = theme.tokens;
  const { avatarBckColor, avatarTextColor, titleColor, descriptionColor, borderColor } = getCardColors(config.cardStatus, theme);
  const { chipBackgroundColor, chipTextColor } = getChipColor(config.topRightElement);
  const titleTypographyVariant = getTitleTypographyVariant(config.cardStatus);

  const getRadius = () => {
    if (title && description && cardAction?.length) return classes.borderRadius20;
    if (title && description) return classes.borderRadius16;
    if (title) return classes.borderRadius12;
    return "";
  };
  return config && !config?.shouldHide ? (
    <MuiCard className={cx(classes.cardRoot, classes[borderColor], getRadius(), propsClasses.card)} data-testid={id}>
      <Grid container>
        <Grid item xs={12}>
          <Grid container flexWrap="nowrap" gap={spacing.default}>
            {/* avatar */}
            {config.avatar || config.avatar === 0 ? (
              <Grid item>
                <StatusAvatar
                  avatarTextColor={avatarTextColor}
                  avatarBckColor={avatarBckColor}
                  config={config}
                  propsClasses={propsClasses}
                />
              </Grid>
            ) : null}
            <Grid item xs={12}>
              {/* title, top right element, description, children(content), footer */}
              <Grid container direction="column">
                {/* title, top right element */}
                <Grid item>
                  <Grid container gap={spacing.default} justifyContent="space-between" flexWrap="nowrap">
                    {/* title */}
                    <Grid item className={cx(classes.title, propsClasses.title)}>
                      {typeof config.title === "string" ? (
                        <Typography variant={titleTypographyVariant} colorValue={titleColor} component={"span"}>
                          {config.title}
                        </Typography>
                      ) : (
                        config.title
                      )}
                    </Grid>
                    {/* top right element */}
                    {config.cardStatus === cardStatusVariants.LOADING ? (
                      <Grid item className={classes.circle}>
                        <CircularProgress className={cx(classes.saving, classes.foreground)} size={sizing.small} thickness={6} />
                        <CircularProgress
                          variant="determinate"
                          value={100}
                          size={sizing.small}
                          className={cx(classes.savingBackground, classes.background)}
                          thickness={6}
                        />
                      </Grid>
                    ) : (
                      config.topRightElement && (
                        <Grid item className={propsClasses.topRightElement}>
                          {config.topRightElement?.type === topRightElementType.ICON && (
                            <MvSvgIcon name={config.topRightElement.iconConfig.icon} />
                          )}
                          {config.topRightElement?.type === topRightElementType.CHIP && (
                            <Chip
                              label={config.topRightElement.chipConfig.label}
                              selected={false}
                              checked={false}
                              typographyClass={cx(classes.chipTypographyClass, classes[chipTextColor], propsClasses.chipTypography)}
                              value={config.topRightElement.chipConfig.label}
                              variant="filled"
                              classes={{
                                chip: cx(classes.chipClass, classes[chipBackgroundColor], propsClasses.chip),
                                boundary: classes.chipBoundaryClass,
                              }}
                            />
                          )}
                          {/* handle for action */}
                          {config.topRightElement?.type === topRightElementType.ACTION && (
                            <Typography
                              variant={TypographyVariants.bodySmallLowEmphasis}
                              colorValue={semColors.neutral.text.mediumEmphasis}
                              onClick={() =>
                                onClick(
                                  config.topRightElement?.type === topRightElementType.ACTION
                                    ? config.topRightElement?.actionConfig?.key
                                    : "",
                                  actionConstants.TOP_RIGHT_ELEMENT
                                )
                              }>
                              {config.topRightElement.actionConfig.label}
                            </Typography>
                          )}

                          {/* handle for react element */}
                          {config.topRightElement?.type === topRightElementType.COMPONENT && config.topRightElement.node}
                        </Grid>
                      )
                    )}
                  </Grid>
                </Grid>
                {/* description, children(content), footer */}
                <Grid item>
                  <Grid container direction="column">
                    {/* description - string or react node */}
                    {config.description && (
                      <Grid
                        item
                        xs={12}
                        className={cx(
                          config.cardStatus === cardStatusVariants.COMPLETED ? "" : classes.description,
                          propsClasses.description
                        )}>
                        {typeof config.description === "string" ? (
                          <Typography variant={TypographyVariants.bodySmallLowEmphasis} colorValue={descriptionColor}>
                            {config.description}
                          </Typography>
                        ) : (
                          config.description
                        )}
                      </Grid>
                    )}

                    {/* content children */}
                    {children && (
                      <Grid item xs={12} className={cx(classes.description, propsClasses.children)}>
                        {children}
                      </Grid>
                    )}

                    {/* footer - string and react node */}
                    {config.footer && (
                      <Grid item xs={12} className={propsClasses.footer}>
                        {typeof config.footer === "string" ? (
                          <Typography variant={TypographyVariants.bodySmallLowEmphasis} colorValue={semColors.neutral.text.lowEmphasis}>
                            {config.footer}
                          </Typography>
                        ) : (
                          config.footer
                        )}
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* new card action */}
        <Grid item xs={12}>
          <Grid container className={propsClasses.cardActionContainer}>
            {/* new card action */}
            {config.cardAction &&
              config.cardAction.map((action) => {
                return (
                  // TODO: future fix action.id string | undefined issue
                  <Grid key={action.id} item xs={12} className={cx(classes.marginTop16, propsClasses.cardAction)}>
                    <Button {...action} size={"buttonSmall"} onClick={() => onClick(action.id, actionConstants.CARD_ACTION)} />
                  </Grid>
                );
              })}
          </Grid>
        </Grid>
      </Grid>
    </MuiCard>
  ) : null;
}
