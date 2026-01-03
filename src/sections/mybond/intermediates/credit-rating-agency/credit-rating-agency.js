import { useState } from 'react';
import {
  Grid,
  Typography,
  Button,
  Box,
  Card,
  Checkbox,
  Tooltip,
  Avatar,
  Alert,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import Iconify from 'src/components/iconify';
import { useGetCreditRatingAgencies } from 'src/api/creditRatingsAndAgencies';
import axiosInstance from 'src/utils/axios';
import { useParams } from 'react-router';

export default function CreditRatingAgency() {
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const { applicationId } = params;
  const { creditRatingAgencies = [], creditRatingAgenciesLoading } = useGetCreditRatingAgencies();

  const [selectedAgencyIds, setSelectedAgencyIds] = useState([]);
  const [showError, setShowError] = useState(false);

  const handleToggle = (id) => {
    setShowError(false);
    setSelectedAgencyIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const onSubmit = async () => {
    if (!selectedAgencyIds.length) {
      setShowError(true);
      enqueueSnackbar('Please select at least one credit rating agency', {
        variant: 'error',
      });
      return;
    }

    const selectedAgencies = creditRatingAgencies.filter((agency) =>
      selectedAgencyIds.includes(agency.id)
    );


    const response = await axiosInstance.post(`/bonds-pre-issue/save-intermediaries/${applicationId}`, {
      creditRatingAgency: selectedAgencies
    });

    if (response?.data?.success) {
      enqueueSnackbar('Request send successfully' , {variant: 'success'} );
    }
  };

  
  const fileUrl =
    'https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  return (
      <>
      <Typography
        variant="h5"
        fontWeight="bold"
        color="primary"
        sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
      >
        <Iconify icon="solar:chart-bold" width={22} />
        Credit Rating Agencies
      </Typography>

      {showError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          You must select at least one credit rating agency
        </Alert>
      )}

      <Grid container spacing={3}>
        {creditRatingAgencies.map((agency) => {
          const checked = selectedAgencyIds.includes(agency.id);

          return (
            <Grid item xs={12} md={6} lg={4} key={agency.id}>
              <Card
                sx={{
                  p: 2.5,
                  height: '100%',
                  position: 'relative',
                  border: checked ? '2px solid #1877F2' : '1px solid #e0e0e0',
                  transition: '0.2s',
                }}
              >
                <Checkbox
                  checked={checked}
                  onChange={() => handleToggle(agency.id)}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                />
                <Box
                  sx={{
                    width: '100%',
                    height: 60,
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}
                >
                  <Box
                    component="img"
                    src={agency.logo?.fileUrl || fileUrl}
                    alt={agency.name}
                    sx={{
                      maxHeight: 50,
                      objectFit: 'contain',
                    }}
                  />
                </Box>

                {/* Name */}
                <Typography fontWeight={600} variant="subtitle1">
                  {agency.name}
                </Typography>

                {/* Description */}
                <Tooltip title={agency.description || ''} arrow>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 0.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {agency.description || 'No description available'}
                  </Typography>
                </Tooltip>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Save */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button variant="contained" onClick={onSubmit}>
          Save
        </Button>
      </Box>
    </>
  );
}
