import React, { useState } from "react";

import { Card as MuiCard, CardContent, Grid } from "@mui/material";

import Typography from "@mvloans/base-ui.typography";
import { MvSvgIcon } from "@mvloans/base-ui.mv-svg-icon";
import Boundary from "@mvloans/base-ui.boundary";
import { IconNames, TypographyVariants } from "@mvloans/base-ui.common";

import { useStyles } from "./styles";

interface Card {
  id: string;
  loanTenure: number | string;
  emi: number | string;
  totalInterest: number | string;
  strikeOffTotalInterest?: number | string;
}

export type PlanSelectorProps = {
  /**
     * Cards List with structure - {[
                        {
                            id: String,
                            loanTenure: number,
                            emi: number,
                            totalInterest: number,
                            reducedInterest?: number | string,
                        }
                    ]}
     */
  cardList: Card[];
  /**
   * Number of cards to be displayed.
   */
  displayCount?: number;
  /**
   * Set the card to be active.
   */
  activeCard?: string;
  /**
   * click listeners to be attached.
   */
  onClick?: (id: string) => void;
  /**
   * identifier used for test cases
   */
  id?: string;
  /**
   * Flag to show/hide interest information
   */
  showInterestInfo?: boolean;
};

export function PlanSelector({ cardList, displayCount = 3, activeCard = "", onClick, id, showInterestInfo = true }: PlanSelectorProps) {
  const { classes, cx, theme } = useStyles();

  const [displayedCount, setDisplayedCount] = useState(displayCount);

  const handleClick = (id: string) => {
    onClick && onClick(id);
  };

  const rupeeSymbol = (isActiveCard?: boolean) => (
    <Typography variant={TypographyVariants.bodySmallLowEmphasis} className={isActiveCard ? classes.fontSize14 : classes.symbolClass}>
      ₹
    </Typography>
  );

  const toMoney = (field: string | number) => {
    return parseFloat(String(field)).toLocaleString("en-IN");
  };

  const strikePrice = (val: string | number) => (
    <Typography variant={TypographyVariants.bodySmallLowEmphasis} className={classes.strikePrice}>
      {` ₹${toMoney(val)}`}
    </Typography>
  );

  const remainingCount =
    cardList?.length <= displayCount ? -1 : cardList?.length - displayedCount >= 0 ? cardList?.length - displayedCount : 0;

  return (
    <Grid container data-testid={id} key={id}>
      <Grid item xs={12} className={classes.headingClass}>
        <Grid container className={classes.containerGap} justifyContent={showInterestInfo ? "normal" : "space-between"}>
          <Grid item className={classes.columnWidth}>
            <Typography
              variant={TypographyVariants.bodyMediumHighEmphasis}
              colorValue={theme.tokens.semColors.neutral.text.mediumEmphasis}
              className={classes.termClass}>
              Loan term
            </Typography>
          </Grid>
          <Grid item>
            <Grid container>
              <Grid item>
                <Typography
                  variant={TypographyVariants.bodyMediumHighEmphasis}
                  colorValue={theme.tokens.semColors.neutral.text.mediumEmphasis}
                  className={classes.emiClass}>
                  EMI
                </Typography>
              </Grid>
              {showInterestInfo && (
                <Grid item>
                  <Typography
                    variant={TypographyVariants.bodySmallLowEmphasis}
                    colorValue={theme.tokens.semColors.neutral.text.lowEmphasis}
                    className={classes.interestClass}>
                    (principal + interest)
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {cardList &&
          cardList.slice(0, displayedCount).map((list, index) => (
            <Boundary className={cx(classes.boundaryClass, activeCard === list.id && classes.selectedCard)} key={index}>
              <MuiCard variant="outlined" className={classes.cardRoot} onClick={(e) => handleClick(list.id)} data-testid={list.id}>
                <CardContent className={classes.cardContent}>
                  <Grid
                    container
                    justifyContent={showInterestInfo ? "normal" : "space-between"}
                    className={cx(classes.containerGap, classes.cardContentGrid)}>
                    <Grid item className={classes.columnWidth}>
                      <Typography
                        variant={
                          activeCard === list.id ? TypographyVariants.bodyLargeHighEmphasis : TypographyVariants.bodyLargeLowEmphasis
                        }
                        className={classes.termClass}
                        colorValue={theme.tokens.semColors.neutral.text.mediumEmphasis}>
                        {`${list.loanTenure} months`}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Grid container className={classes.emiSection} direction={"row"} alignItems={"center"} flexWrap={"nowrap"}>
                        <Grid item>
                          <Typography
                            variant={
                              activeCard === list.id ? TypographyVariants.bodyLargeHighEmphasis : TypographyVariants.bodyLargeLowEmphasis
                            }
                            colorValue={theme.tokens.semColors.neutral.text.mediumEmphasis}
                            className={classes.emiClass}>
                            {rupeeSymbol(activeCard === list.id)}
                            {toMoney(list.emi)}
                          </Typography>
                        </Grid>
                        {showInterestInfo && (
                          <Grid item container direction={"row"} alignItems={"center"}>
                            <Typography
                              variant={TypographyVariants.bodySmallLowEmphasis}
                              colorValue={
                                activeCard === list.id
                                  ? theme.tokens.semColors.neutral.border.quaternary
                                  : theme.tokens.semColors.neutral.text.lowEmphasis
                              }>
                              (int: {rupeeSymbol()}
                              {toMoney(list.totalInterest)}
                              {list && list.strikeOffTotalInterest && strikePrice(list.strikeOffTotalInterest)})
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              </MuiCard>
            </Boundary>
          ))}
      </Grid>
      {remainingCount >= 0 && (
        <Grid item xs={12} className={classes.displayCardClass}>
          <Typography
            variant={TypographyVariants.bodySmallHighEmphasis}
            colorValue={theme.tokens.semColors.neutral.text.mediumEmphasis}
            onClick={() => setDisplayedCount(remainingCount <= 0 ? displayCount : displayedCount + displayCount)}>
            <Typography variant={TypographyVariants.bodySmallLink}>
              {remainingCount <= 0 ? "See less" : `See ${remainingCount >= displayCount ? displayCount : remainingCount} more`}
            </Typography>
            <MvSvgIcon
              name={remainingCount <= 0 ? IconNames.upArrowIcon : IconNames.downArrowIcon}
              width={theme.tokens.sizing.xSmall}
              classes={classes.showCards}
            />
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}
