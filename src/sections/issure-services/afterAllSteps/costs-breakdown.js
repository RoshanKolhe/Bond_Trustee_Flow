import React from "react";
import {
    Box,
    Card,
    Grid,
    Stack,
    Typography,
    List,
    ListItem,
} from "@mui/material";
import Chart, { useChart } from "src/components/chart";

// ------------------------------------------------------
// ✅ Convert "₹ 10,80,000" → 1080000 and return percentages
// ------------------------------------------------------
function getChartPercentages(costData) {
    const numericValues = costData.map((item) =>
        Number(item.value.replace(/[₹,\s]/g, ""))
    );
    const total = numericValues.reduce((sum, val) => sum + val, 0);
    const percentages = numericValues.map((val) => (val / total) * 100);
    return percentages.map((p) => Math.round(p * 100) / 100);
}

// ------------------------------------------------------
// ✅ Component
// ------------------------------------------------------
export default function CostsBreakdown() {
    const COST_DATA = [
        { name: "Professional & Advisory Fees", value: "₹ 10,80,000", color: "#00A76F", img:"/assets/icons/costs-breakdown/professional-fees.svg" },
        { name: "Regulatory & Statutory Costs", value: "₹ 6,40,000", color: "#FFAB00", img:"/assets/icons/costs-breakdown/regulatory-costs.svg"  },
        { name: "Placement & Distribution Costs", value: "₹ 24,80,000", color: "#FF5630", img:"/assets/icons/costs-breakdown/placement-costs.svg"  },
        { name: "Documentation & Printing", value: "₹ 3,85,000", color: "#00D5E8", img:"/assets/icons/costs-breakdown/documentation-costs.svg" },
        { name: "Miscellaneous Costs", value: "₹ 7,20,000", color: "#C738FF", img:"/assets/icons/costs-breakdown/costs-miscall.svg"  },
        { name: "Security Creation & Compliance Costs", value: "₹ 6,60,000", color: "#6D00D9", img:"/assets/icons/costs-breakdown/security-costs.svg" },
        { name: "Marketing & Communication", value: "₹ 5,20,000", color: "#070297", img:"/assets/icons/costs-breakdown/marketing-costs.svg" },
    ];

    const CHART_DATA = getChartPercentages(COST_DATA);

    const chartOptions = useChart({
        chart: { type: "pie" },
        colors: COST_DATA.map((i) => i.color),
        labels: COST_DATA.map((i) => i.name),
        legend: { show: false },
        tooltip: { y: { formatter: (val) => `${val.toFixed(1)}%` } },
        stroke: { colors: ["transparent"], width: 0 },
        dataLabels: {
            enabled: true,
            formatter: (val) => `${Math.round(val)}%`,
            dropShadow: { enabled: false },
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "80%",
                    labels: {
                        show: true,
                        name: { show: false },
                        value: {
                            show: true,
                            formatter: (val) => `${val}%`,
                        },
                        total: { show: false },
                    },
                },
            },
        },
    });

    const leftItems = COST_DATA.slice(0, 4);
    const rightItems = COST_DATA.slice(4);

    return (
        <Card
        >
            {/* Header */}
            <Grid item xs={12}
                sx={{
                    background: "linear-gradient(90deg, #00A76F 0%, #00A78B 100%)",

                    borderRadius: 2,
                    p: 2,
                    mb: 3,
                    color: "#fff",
                }}
            >
                <Typography variant="h3" fontWeight={700}>
                    Costs Breakdown
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Breakdown of actual costs for better decision making.
                </Typography>
            </Grid>

            {/* Body */}
            <Grid container spacing={3} alignItems="center" padding="6px">
                {/* Left side - cost values */}
                <Grid item xs={12} md={5}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <List disablePadding>
                                {leftItems.map((item, index) => (
                                    <ListItem key={index} sx={{ py: 1, px: 0 }}>
                                        <Stack direction="row" alignItems="center" spacing={1.5}>
                                            <Box
                                                component="img"
                                                src= {item.img}
                                                alt="Trending"
                                                sx={{
                                                    width: 20,
                                                    height: 20,
                                                    position: 'relative',
                                                }}
                                            />
                                            <Box>
                                                <Typography
                                                    variant="body2"
                                                    sx={{ color: "#000" }}
                                                >
                                                    {item.name}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{ color: "#555", fontSize: "0.85rem" }}
                                                >
                                                    {item.value}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <List disablePadding>
                                {rightItems.map((item, index) => (
                                    <ListItem key={index} sx={{ py: 1, px: 0 }}>
                                        <Stack direction="row" alignItems="center" spacing={1.5}>
                                            <Box
                                                component="img"
                                                src= {item.img}
                                                alt="Trending"
                                                sx={{
                                                    width: 20,
                                                    height: 20,
                                                    position: 'relative',
                                                }}
                                            />
                                            <Box>
                                                <Typography
                                                    variant="body2"
                                                    sx={{ color: "#000" }}
                                                >
                                                    {item.name}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{ color: "#555", fontSize: "0.85rem" }}
                                                >
                                                    {item.value}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Middle - chart */}
                <Grid item xs={12} md={4}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: 300,
                        }}
                    >
                        <Chart
                            type="pie"
                            series={CHART_DATA}
                            options={chartOptions}
                            width={300}
                            height={300}
                        />
                    </Box>
                </Grid>

                {/* Right side - chart legend */}
                <Grid item xs={12} md={3}>
                    <List disablePadding>
                        {COST_DATA.map((item, index) => (
                            <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                    <Box
                                        sx={{
                                            width: 14,
                                            height: 14,
                                            borderRadius: "1%",
                                            backgroundColor: item.color,
                                        }}
                                    />
                                    <Typography variant="body2" sx={{ color: "#000" }}>
                                        {item.name}
                                    </Typography>
                                </Stack>
                            </ListItem>
                        ))}
                    </List>
                </Grid>
            </Grid>
        </Card>
    );
}
