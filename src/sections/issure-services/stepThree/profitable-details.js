import React from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from 'src/components/hook-form';


export default function ProfitabilityDetails() {
 
  return (
      <Box display="flex" flexDirection="column" gap={3}>
        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: 3,
            border: '1px solid #e0e0e0',
          }}
        >
          <Typography variant="h3" fontWeight={600} color="#1874ED" mb={2}>
            Profitability Details
          </Typography>

          <Grid container spacing={2} alignItems="center">
  
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="netProfit"
                label="Net Profit"
                fullWidth
                type="number"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="ebidta"
                label="Enter EBIDTA Amount"
                fullWidth
                type="number"
              />
            </Grid>
          </Grid>
        </Card>
      </Box>
  );
}
