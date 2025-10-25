import React, { ReactNode } from "react";
import { Box, Card as MuiCard, CardContent, CardHeader, Chip } from "@mui/material";
import Typography from "@mvloans/base-ui.typography";
import { IconNames, PWA_ICONS, TypographyVariants } from "@mvloans/base-ui.common";
import { MvSvgIcon } from "@mvloans/base-ui.mv-svg-icon";
import Icon from "@mvloans/base-ui.icon";
import { cardVariants } from "./constants";
import { useStyles } from "./styles";

export type CardProps = {
  /**
   * a node to be rendered in the special component.
   */
  children?: ReactNode;
  /**
   * ID for the card
   */
  id: string;
  /**
   * Set variant of card -
   * cardVariant1 | cardVariant2
   */
  variant: cardVariants;
  /**
   * Text displayed inside the chip
   */
  chipText?: string;
  /**
   * Set card icon
   */
  icon?: string;
  /**
   * Set card icon using string
   */
  src?: string;
  /**
   * Card Title
   */
  title: string;
  /**
   * Card subtitle
   */
  subTitle?: string;
  /**
   * Third line displayed in the card (for cardVariant1)
   */
  text?: string;
  /**
   * Icon displayed on the third line in the card (for cardVariant1)
   */
  textIcon?: string;
  /**
   * Icon displayed on the third line in the card (for cardVariant1) with src
   */
  textIconSrc?: string;
  /**
   * Attach on click listener to card
   */
  onClick?: (event: any, id: string) => any;
  /**
   * Additional classes to override.
   */
  classes?: CardClasses;
  /**
   * ID for testing
   */
  dataTestId?: string;
};

export interface CardClasses {
  actionIcon?: string;
  avatarIcon?: string;
  cardContent?: string;
  contentIcon?: string;
  cardAction?: string;
  chip?: string;
  cardContainer?: string;
  cardRoot?: string;
  cardHeader?: string;
}

export function Card({
  children,
  id,
  variant,
  icon,
  src,
  title,
  subTitle = " ",
  text,
  textIcon,
  textIconSrc,
  chipText,
  onClick,
  classes: propsClasses = {},
  dataTestId,
}: CardProps) {
  const { classes, cx, theme } = useStyles();

  let avatarIcon: JSX.Element | undefined,
    actionIcon: JSX.Element | undefined,
    headerTitle: JSX.Element | undefined,
    headerSubtitle: JSX.Element | undefined,
    content: ReactNode | undefined | null;

  const getSubtitle = (subtitle: string) => {
    return (
      <>
        {subtitle ? (
          <Typography
            className={classes.disableSpacing}
            colorValue={theme.tokens.semColors.neutral.text.lowEmphasis}
            variant={TypographyVariants.bodySmallLowEmphasis}>
            {subtitle}
          </Typography>
        ) : null}
      </>
    );
  };

  const getContent = () => {
    actionIcon = <MvSvgIcon name={IconNames.chevronRightIcon} classes={cx(classes.iconClass, propsClasses.actionIcon)} />;
    switch (variant) {
      case cardVariants.CARD_VARIANT_1:
        avatarIcon = (
          <MvSvgIcon name={icon || ""} append={PWA_ICONS} src={src} classes={cx(classes[`${variant}Icon`], propsClasses.avatarIcon)} />
        );

        headerTitle = (
          <Typography
            className={cx(classes.disableSpacing, classes.typographyTitleClass)}
            variant={TypographyVariants.bodyMediumHighEmphasis}
            colorValue={theme.tokens.semColors.neutral.text.mediumEmphasis}>
            {title}
          </Typography>
        );
        headerSubtitle = getSubtitle(subTitle);
        content = (
          <CardContent className={cx(classes[`${variant}Content`], propsClasses.cardContent)}>
            {text && (textIcon || textIconSrc) && (
              <Box className={cx(classes[`${variant}Action`], propsClasses.cardAction)}>
                {textIcon || textIconSrc ? (
                  <MvSvgIcon
                    name={textIcon || ""}
                    append={PWA_ICONS}
                    src={textIconSrc}
                    classes={cx(classes[`${variant}ContentIcon`], propsClasses.contentIcon)}
                  />
                ) : null}

                <Typography variant={TypographyVariants.bodyTinyLowEmphasis} colorValue={theme.tokens.semColors.neutral.text.lowEmphasis}>
                  {text}
                </Typography>
              </Box>
            )}
            {children}
          </CardContent>
        );
        break;
      case cardVariants.CARD_VARIANT_2:
        avatarIcon = (
          <MvSvgIcon name={icon || ""} append={PWA_ICONS} src={src} classes={cx(classes[`${variant}Icon`], propsClasses.avatarIcon)} />
        );
        content = (
          <CardContent className={cx(classes[`${variant}Content`], propsClasses.cardContent)}>
            <Typography
              className={cx(classes.disableSpacing, classes.typographyTitleClass)}
              colorValue={theme.tokens.semColors.neutral.text.mediumEmphasis}
              variant={TypographyVariants.bodyLargeHighEmphasis}>
              {title}
            </Typography>
            {getSubtitle(subTitle)}
            {text && (textIcon || textIconSrc) && (
              <Box className={cx(classes[`${variant}Action`], propsClasses.cardAction)}>
                {textIcon || textIconSrc ? (
                  <MvSvgIcon
                    name={textIcon || ""}
                    append={PWA_ICONS}
                    src={textIconSrc}
                    classes={cx(classes[`${variant}ContentIcon`], propsClasses.contentIcon)}
                  />
                ) : null}
                <Typography variant={TypographyVariants.bodyTinyLowEmphasis} colorValue={theme.tokens.semColors.neutral.text.lowEmphasis}>
                  {text}
                </Typography>
              </Box>
            )}
            {children}
          </CardContent>
        );
        break;
      default:
        break;
    }
  };

  getContent();

  return (
    <Box className={cx(classes.cardContainer, propsClasses.cardContainer)}>
      {chipText && (
        <Chip
          label={
            <Typography
              variant={TypographyVariants.bodyTinyHighEmphasis}
              colorValue={theme.tokens.semColors.neutral.text.highEmphasisInverse}>
              {chipText}
            </Typography>
          }
          className={cx(classes.chipClass, propsClasses.chip)}
        />
      )}
      <MuiCard
        className={cx(classes.cardRoot, propsClasses.cardRoot)}
        onClick={(event) => onClick && onClick(event, id)}
        id={id}
        data-testid={dataTestId}>
        <CardHeader
          avatar={avatarIcon}
          action={actionIcon}
          disableTypography={true}
          title={headerTitle}
          subheader={headerSubtitle}
          className={cx(classes[`${variant}Header`], propsClasses.cardHeader)}
        />
        {content}
      </MuiCard>
    </Box>
  );
}
