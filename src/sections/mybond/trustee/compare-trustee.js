import React from "react";
import {
    Box,
    Typography,
    Divider,
    Avatar,
    Card,
    Grid,
    Stack,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";

export default function CompareTrusteeView() {
    const [searchParams] = useSearchParams();
    const selectedIds = searchParams.get("ids")?.split(",").map(Number) || [];

    const ALL_TRUSTEES = [
        {
            id: 1,
            name: "CATALYST TRUSTEESHIP LIMITED (FORMERLY GDA TRUSTEESHIP LIMITED)",
            experience: "10 + yrs",
            expValue: 10,
            responseTime: "2 hrs",
            responseHours: 2,
            pastIssue: "50+ secured issues",
            pastValue: 50,
            reputation: "4.8/5.0",
            repValue: 4.8,
            regulatoryStatus: "SEBI / RBI registered",
            feeStructure: "₹2L setup + ₹1L annual",
            techCapability: "Digital docs / API",
            supportInChargeCreation: "Yes",
        },
        {
            id: 2,
            name: "IDBI TRUSTEESHIP SERVICES LIMITED",
            experience: "8 + yrs",
            expValue: 8,
            responseTime: "1 hr",
            responseHours: 1,
            pastIssue: "40+ secured issues",
            pastValue: 40,
            reputation: "4.6/5.0",
            repValue: 4.6,
            regulatoryStatus: "SEBI / RBI registered",
            feeStructure: "₹50k setup + ₹1L annual",
            techCapability: "Digital docs / API",
            supportInChargeCreation: "Yes",
        },
        {
            id: 3,
            name: "Zenith Capital Advisors",
            experience: "8 + yrs",
            expValue: 8,
            responseTime: "1 hr",
            responseHours: 1,
            pastIssue: "30+ secured issues",
            pastValue: 30,
            reputation: "4.4/5.0",
            repValue: 4.4,
            regulatoryStatus: "SEBI / RBI registered",
            feeStructure: "₹1.5L setup + ₹70K annual",
            techCapability: "Digital docs / API",
            supportInChargeCreation: "Yes",
        },
    ];

    const trustees = ALL_TRUSTEES.filter((t) => selectedIds.includes(t.id));

    const bestExp = Math.max(...trustees.map((t) => t.expValue));
    const bestIssues = Math.max(...trustees.map((t) => t.pastValue));
    const bestFees = Math.min(...trustees.map((t) => t.feeStructure));
    const bestResponse = Math.min(...trustees.map((t) => t.responseHours));

    const highlight = (condition) =>
        condition ? { color: "#1b5e20" , fontWeight: "bold" } : { color: "#b71c1c" };


    return (
        <Box>
            <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
                Compare Trustees
            </Typography>

            <Grid container spacing={3}>
                {trustees.map((t) => (
                    <Grid item xs={12} md={6} key={t.id}>
                        <Card sx={{ p: 3, borderRadius: 3 }}>
                            <Box display="flex" alignItems="center" gap={2} mb={2}>
                                <Avatar sx={{ bgcolor: "#0D47A1", width: 60, height: 60 }}>
                                    {t.name[0]}
                                </Avatar>

                                <Typography variant="h6" fontWeight="bold">{t.name}</Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Stack spacing={1.3}>
                                <Typography sx={highlight(t.expValue === bestExp)}>
                                    <strong>Experience:</strong> {t.experience}
                                </Typography>

                                <Typography sx={highlight(t.pastValue === bestIssues)}>
                                    <strong>Past Issues:</strong> {t.pastIssue}
                                </Typography>

                                <Typography>
                                    <strong>Reputation:</strong> {t.reputation}
                                </Typography>

                                <Typography sx={highlight(t.responseHours === bestResponse)}>
                                    <strong>Response:</strong> {t.responseTime}
                                </Typography>

                                <Typography ><strong>Fees:</strong> {t.feeStructure}</Typography>
                                <Typography ><strong>Regulatory:</strong> {t.regulatoryStatus}</Typography>
                                <Typography><strong>Tech Capability:</strong> {t.techCapability}</Typography>
                                <Typography><strong>Support Creation:</strong> {t.supportInChargeCreation}</Typography>
                            </Stack>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
