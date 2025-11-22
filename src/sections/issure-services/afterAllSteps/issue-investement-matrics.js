import React from "react";
import {
  Card,
  Grid,
  Paper,
  Stack,
  Typography,
  Divider,
  Box,
} from "@mui/material";

 const metrics = [
    { title: "Total Subscription Target", value: "₹ 5,000,000" },
    { title: "Proposed Total Investment", value: "₹ 3,500,000" },
    { title: "Estimated Returns", value: "₹ 800,000" },
  ];

export default function IssueInvestmentMatrics() {

  return (
 <Box>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 600,
          color: "#1976d2",
          mb: 3,
        }}
      >
        Issue Investment Metrics
      </Typography>

      <Grid container spacing={2}>
        {metrics.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              elevation={2}
              sx={{
                p: 2.5,
                textAlign: "left",
                borderRadius: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                },
              }}
            >
              <Stack spacing={0.5}>
                <Typography
                  variant="subtitle2"
                 
                  sx={{  color: "#000000", fontWeight: 500  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                     color: "#000000",
                  }}
                >
                  {item.value}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
</Box>
  );
}
