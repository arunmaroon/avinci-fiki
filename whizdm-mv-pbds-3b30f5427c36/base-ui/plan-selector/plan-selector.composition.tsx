import React, { useState } from "react";
import { PlanSelector } from "./plan-selector";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import { Box } from "@mui/material";

export const InteractivePlanSelectorCard = () => {
    const [activeCard, setActiveCard] = useState("");
    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}>
            <Box
                sx={{
                    maxWidth: { xs: 312, md: 480 },
                }}>
                <ThemeProvider>
                    <PlanSelector
                        cardList={[
                            {
                                id: "abcd",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                                strikeOffTotalInterest: "1000",
                            },
                            {
                                id: "efgh",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                            {
                                id: "ijkl",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                            {
                                id: "mnop",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                            {
                                id: "qrst",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                            {
                                id: "uvwx",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                            {
                                id: "yzab",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                        ]}
                        activeCard={activeCard}
                        displayCount={3}
                        onClick={(id) => setActiveCard(id)}
                        id='InteractivePlanSelectorCard'
                    />
                </ThemeProvider>
            </Box>
        </Box>
    );
};

export const SelectedPlanSelectorCard = () => {
    const [activeCard, setActiveCard] = useState("abcd");
    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}>
            <Box
                sx={{
                    maxWidth: { xs: 312, md: 480 },
                }}>
                <ThemeProvider>
                    <PlanSelector
                        cardList={[
                            {
                                id: "abcd",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                            {
                                id: "efgh",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                            {
                                id: "ijkl",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                            {
                                id: "mnop",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                            {
                                id: "qrst",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                            {
                                id: "uvwx",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                            {
                                id: "yzab",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                        ]}
                        activeCard={activeCard}
                        displayCount={3}
                        onClick={(id) => setActiveCard(id)}
                        id='SelectedPlanSelectorCard'
                    />
                </ThemeProvider>
            </Box>
        </Box>
    );
};

export const UnselectedPlanSelectorCard = () => {
    const [activeCard, setActiveCard] = useState("");
    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}>
            <Box
                sx={{
                    maxWidth: { xs: 312, md: 480 },
                }}>
                <ThemeProvider>
                    <PlanSelector
                        cardList={[
                            {
                                id: "abcd",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                            {
                                id: "efgh",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                            {
                                id: "ijkl",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                            {
                                id: "mnop",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                            {
                                id: "qrst",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                            {
                                id: "uvwx",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                            {
                                id: "yzab",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                        ]}
                        activeCard={activeCard}
                        displayCount={2}
                        onClick={(id) => setActiveCard(id)}
                        id='SelectedPlanSelectorCard'
                    />
                </ThemeProvider>
            </Box>
        </Box>
    );
};

export const PlanSelectorCardWithoutDisplayCount = () => {
    const [activeCard, setActiveCard] = useState("efgh");
    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}>
            <Box
                sx={{
                    maxWidth: { xs: 312, md: 480 },
                }}>
                <ThemeProvider>
                    <PlanSelector
                        cardList={[
                            {
                                id: "abcd",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                            {
                                id: "efgh",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                            {
                                id: "ijkl",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                            {
                                id: "mnop",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                            {
                                id: "qrst",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                            {
                                id: "uvwx",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                            {
                                id: "yzab",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                        ]}
                        activeCard={activeCard}
                        onClick={(id) => setActiveCard(id)}
                    />
                </ThemeProvider>
            </Box>
        </Box>
    );
};

export const PlanSelectorCardWithDisplayCountEqualToListLength = () => {
    const [activeCard, setActiveCard] = useState("efgh");
    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}>
            <Box
                sx={{
                    maxWidth: { xs: 312, md: 480 },
                }}>
                <ThemeProvider>
                    <PlanSelector
                        cardList={[
                            {
                                id: "abcd",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                            {
                                id: "efgh",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                            {
                                id: "ijkl",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                            {
                                id: "mnop",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                            {
                                id: "qrst",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                            {
                                id: "uvwx",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                            {
                                id: "yzab",
                                loanTenure: 36,
                                emi: "8797",
                                totalInterest: "650",
                            },
                        ]}
                        activeCard={activeCard}
                        displayCount={7}
                        onClick={(id) => setActiveCard(id)}
                    />
                </ThemeProvider>
            </Box>
        </Box>
    );
};
