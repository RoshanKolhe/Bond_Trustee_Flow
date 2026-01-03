import React, { useCallback } from "react";
import {
    Box,
    Typography,
    Divider,
    Avatar,
    Button,
    Card,
    Stack
} from "@mui/material";
import { useRouter } from "src/routes/hook";
import { paths } from "src/routes/paths";

export default function TrusteeDetailsView() {

    const router = useRouter();
    const trustee = {
        id: 1,
        name: "CATALYST TRUSTEESHIP LIMITED (FORMERLY GDA TRUSTEESHIP LIMITED)",
        experience: "10+ yrs",
        regulatoryStatus: "SEBI / RBI registered",
        feeStructure: "₹2L setup + ₹1L annual",
        responseTime: "2 hrs",
        pastIssue: "50+ secured issues",
        techCapability: "Digital docs / API",
        reputation: "4.8/5.0",
        supportInChargeCreation: "Yes",
    };

    const handleViewRow = useCallback(
        () => {
            router.push(paths.dashboard.trustee.details);
        },
        [router]
    );

    return (
        <>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="bold">
                    Trustee Details
                </Typography>

                <Button
                    variant="contained"
                    sx={{
                        bgcolor: '#1976d2',
                        textTransform: 'none',

                        py: 1.5,
                        boxShadow: 'none',
                        '&:hover': {
                            bgcolor: '#1565c0',
                            boxShadow: 'none',
                        },
                    }}
                    onClick={() => handleViewRow()}
                >
                    Update Trustee
                </Button>
            </Box>

            {/* Card */}
            <Card sx={{ p: 3, borderRadius: 3 }}>
                {/* Profile */}
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar
                        sx={{
                            bgcolor: "#0D47A1",
                            width: 70,
                            height: 70,
                            borderRadius: 2,
                            fontSize: 24,
                            fontWeight: "bold",
                        }}
                    >
                        CT
                    </Avatar>

                    <Box>
                        <Typography variant="h6" fontWeight="bold">{trustee.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {trustee.regulatoryStatus}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Simple Display */}
                <Stack spacing={1.2}>
                    <Typography><strong>Experience:</strong> {trustee.experience}</Typography>
                    <Typography><strong>Fee Structure:</strong> {trustee.feeStructure}</Typography>
                    <Typography><strong>Response Time:</strong> {trustee.responseTime}</Typography>
                    <Typography><strong>Past Issues:</strong> {trustee.pastIssue}</Typography>
                    <Typography><strong>Tech Capability:</strong> {trustee.techCapability}</Typography>
                    <Typography><strong>Reputation:</strong> {trustee.reputation}</Typography>
                    <Typography><strong>Support In Charge Creation:</strong> {trustee.supportInChargeCreation}</Typography>
                </Stack>
            </Card>
        </>
    );
}
