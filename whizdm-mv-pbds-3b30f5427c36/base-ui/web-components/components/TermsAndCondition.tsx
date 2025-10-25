import React from "react";
import Container from "./Container";
import { Box, Grid } from "@mui/material";
import colors from "../colors";
import MvTypography from "./WebTypography";
import { termsAndConditionList } from "../web-componentsConstants";

const TermsAndCondition = ({ pageCategory }: { pageCategory: string }) => {
  return (
    <Box sx={{ backgroundColor: colors["--grey02"] }}>
      <Container>
        <Grid
          container
          sx={{
            gridColumn: "1/-1",
            padding: "24px 0px",
          }}>
          {termsAndConditionList
            .filter((item) => item.pageCategory === pageCategory)
            .map((item, index) => (
              <Grid item key={item.content + index}>
                <MvTypography
                  overrideStyle={{
                    fontSize: "12px",
                    lineHeight: "18px",
                  }}>
                  {item.content}
                </MvTypography>
              </Grid>
            ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TermsAndCondition;
