import React from "react";

import {
    Box,
    Card,
    Grid,
    Paper,
    Stack,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
} from "@mui/material";

const metrics = [
    { title: "User Requirement ", value: "₹ 500,000", img: "/assets/icons/scenario-comparison/user-requirment.png",label:"Projected issue amount" },
    { title: "System Recommended Issue amount", value: "₹ 650,000",img: "/assets/icons/scenario-comparison/system-issue.png", label:"Optimal" },

];

const comparisonData = [
    {
        parameter: "Issue Size",
        userInput: "₹ 5,00,000",
        systemRec: "₹ 6,50,000",
        better: false,
    },
    {
        parameter: "Coupon Rate",
        userInput: "11%",
        systemRec: "8.5%",
        better: true,
        betterLabel: "Better",
    },
    {
        parameter: "Tenure",
        userInput: "11 Years",
        systemRec: "10 Years",
        better: true,
        betterLabel: "Better",
    },
    {
        parameter: "Security Type",
        userInput: "Collateral",
        systemRec: "Secured, collateral",
        better: true,
        betterLabel: "Better",
    },
    {
        parameter: "Est. Total Cost",
        userInput: "₹ 10.5 L",
        systemRec: "₹ 8.25 L",
        better: true,
        betterLabel: "Save ₹2.25",
    },
];

export default function ScenarioComparison() {

    return (
        <Box>
            <Stack spacing={3}>
                <Card sx={{ backgroundColor: "#006DE5" }}>
                    <Typography
                        variant="h3"
                        sx={{
                            pt: 2,
                            pl: 2,
                            fontWeight: 600,
                            color: "#ffff",
                            mb: 3,
                        }}
                    >
                        Scenario Comparison
                    </Typography>

                    <Typography
                        variant="subtitle2"
                        sx={{
                            pb: 2,
                            pl: 2,
                            color: "#ffff",


                        }}
                    >
                        See how user inputs compare with system recommendations.
                    </Typography>

                </Card>
                <Grid container spacing={3} >
                    {metrics.map((item, index) => (
                        <Grid item xs={12} sm={6} md={6} key={index}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    border: "1px solid #C7C7C7",
                                    backgroundColor: "#fff",
                                    boxShadow: "0px 3px 8px rgba(0,0,0,0.08)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                }}
                            >
                                <Box
                                    component="img"
                                    src={item.img}
                                    alt={item.title}
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 1,
                                        objectFit: "cover",
                                    }}
                                />

                                <Stack spacing={0.8}>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{ color: "#000", fontWeight: 600 }}
                                    >
                                        {item.title}
                                    </Typography>

                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 700,
                                            color: "#000",
                                        }}
                                    >
                                        {item.value}
                                    </Typography>


                                    <Chip
                                        label={item.label}
                                     
                                        sx={{
                                            backgroundColor: "#B7D6FF",
                                            color: "#000",
                                            fontWeight: 500,
                                            width: "fit-content",
                                            fontSize: "0.75rem",
                                            borderRadius: "6px",
                                            height: 24,
                                            
                                        }}
                                    />
                                </Stack>
                            </Paper>
                        </Grid>
                    ))}
                </Grid> 
                <TableContainer
                    component={Paper}
                    sx={{
                        mt: 3,
                        borderRadius: 2,
                        overflow: "hidden",
                        boxShadow: "0px 3px 8px rgba(0,0,0,0.1)",
                        border: "1px solid #BDBDBD",
                    }}
                >
                    <Table
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        backgroundColor: "#2F2F2F",
                                        color: "#fff",
                                        fontWeight: 600,
                                        fontSize: "0.95rem",
                                        width: "40%",
                                        borderRight: "1px solid #BDBDBD",
                                        borderBottom: "1px solid #BDBDBD",
                                    }}
                                >
                                    Parameter
                                </TableCell>
                                <TableCell
                                    sx={{
                                        backgroundColor: "#0053AB",
                                        fontWeight: 600,
                                        color: "#000",
                                        fontSize: "0.95rem",
                                        width: "30%",
                                        borderRight: "1px solid #BDBDBD",
                                        borderBottom: "1px solid #BDBDBD",
                                    }}
                                >
                                    Your Input
                                </TableCell>
                                <TableCell
                                    sx={{
                                        backgroundColor: "#00A786",
                                        fontWeight: 600,
                                        color: "#000",
                                        fontSize: "0.95rem",
                                        width: "30%",
                                        borderBottom: "1px solid #BDBDBD",

                                    }}
                                >
                                    System Rec
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {comparisonData.map((row, index) => (
                                <TableRow
                                    key={index}
                                >
                                    <TableCell
                                        sx={{
                                            fontWeight: 500,
                                            color: "#000",
                                            borderRight: "1px solid #E0E0E0",
                                            borderBottom: "1px solid #E0E0E0",
                                        }}
                                    >
                                        {row.parameter}
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            color: "#d32f2f",
                                            fontWeight: 600,
                                            borderRight: "1px solid #E0E0E0",
                                            borderBottom: "1px solid #E0E0E0",
                                        }}
                                    >
                                        {row.userInput}
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            color: "#2E7D32",
                                            fontWeight: 600,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            borderBottom: "1px solid #E0E0E0",

                                        }}
                                    >
                                        {row.systemRec}
                                        {row.better && (
                                            <Chip
                                                label={row.betterLabel}
                                                size="small"
                                                sx={{
                                                    bgcolor: row.betterLabel?.includes("Save")
                                                        ? "#E3F2FD"
                                                        : "#E8F5E9",
                                                    color: row.betterLabel?.includes("Save")
                                                        ? "#1565C0"
                                                        : "#2E7D32",
                                                    fontWeight: 600,
                                                }}
                                            />
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                </TableContainer>

            </Stack>
        </Box>
    );
}
