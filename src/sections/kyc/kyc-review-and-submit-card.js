// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
// components
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';
// sections
import KYCTitle from './kyc-title';
import KYCFooter from './kyc-footer';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Iconify from 'src/components/iconify';

import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

export default function KYCReviewAndSubmitCard({ icon, title, editPath, data, isFullWidth }) {
  return (
    <>
      <Box sx={{ border: '1px solid #D9D9D9', borderRadius: 1, p: 3, mt: 3 }}>
        {/* Header with edit button */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            borderBottom: '1px solid #F0F0F0',
            pb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Iconify icon={icon} color="#0057CA" width={24} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
              {title}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            sx={{ textTransform: 'none', color: '#0057CA', borderColor: '#0057CA' }}
            startIcon={<Iconify icon="eva:edit-2-outline" width={16} />}
          >
            Edit
          </Button>
        </Box>

        {/* Two-column layout for contact details */}
        <Grid container spacing={2}>
          {/* Left column */}
          <Grid xs={12} md={isFullWidth ? 12 : 6}>
            <Box sx={{ '& > div': { display: 'flex', flexDirection: 'column', mb: 2 } }}>
              {data
                .slice(0, isFullWidth ? data.length : Math.ceil(data.length / 2))
                .map((item, index) => (
                  <div key={index}>
                    <Box sx={{ color: '#8C8C8C', mb: 0.5, mt: index > 0 ? 2 : 0 }}>{item.title}</Box>
                    <Box sx={{ color: '#1A1A1A' }}>{item.value}</Box>
                  </div>
                ))}
            </Box>
          </Grid>

          {/* Right column */}
          {!isFullWidth && (
            <Grid xs={12} md={6}>
              <Box sx={{ '& > div': { display: 'flex', flexDirection: 'column', mb: 2 } }}>
                {data
                  .slice(Math.ceil(data.length / 2))
                  .map((item, index) => (
                    <div key={index + Math.ceil(data.length / 2)}>
                      <Box sx={{ color: '#8C8C8C', mb: 0.5, mt: index > 0 ? 2 : 0 }}>{item.title}</Box>
                      <Box sx={{ color: '#1A1A1A' }}>{item.value}</Box>
                    </div>
                  ))}
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
}

KYCReviewAndSubmitCard.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  editPath: PropTypes.string,
  data: PropTypes.object,
  isFullWidth: PropTypes.bool,
};
