import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'src/routes/hook/use-router';
import { Grid, Tooltip } from '@mui/material';

// ----------------------------------------------------------------------

export default function BondLibraryCardGrid({ item }) {
  const theme = useTheme();
  const router = useRouter();

  const handleKnowMore = () => {
    router.push(`/bond-details/${item?.isin_code}`);
  };

  //   {
  //     "isin_code": "INE013A07L06",
  //     "price": "1000000.00",
  //     "tenure": {
  //         "years": -2008,
  //         "months": -8,
  //         "days": -5
  //     },
  //     "ratings": [
  //         {
  //             "agency": "CARE",
  //             "rating": "AAA"
  //         }
  //     ],
  //     "security_type": null,
  //     "isin_description": "ZERO COUPON SECURED REDEEMABLE NON CONVERTIBLE DEBENTURES. SERIES FB-NCD 321. DATE OF MATURITY 10/02/2017",
  //     "issue_description": "RELIANCE CAPITAL LIMITED SR-FB/321 NCD 10FB17 FVRS10LAC",
  //     "coupon_rate_percent": "0.000",
  //     "maturity_date": "0017-02-10",
  //     "ytm_percent": null,
  //     "face_value_rs": "1000000.00",
  //     "issuer_name": null,
  //     "issuer_type": null,
  //     "issue_size_lakhs": "10000.00",
  //     "issue_date": null,
  //     "isin_active": true,
  //     "listed_unlisted": "Listed",
  //     "trading_status": null,
  //     "tax_category": "TAXABLE",
  //     "secured": true,
  //     "transferable": false,
  //     "primary_exchange": "NSE",
  //     "minimum_investment_rs": null,
  //     "interest_payment_frequency": "UNKNOWN",
  //     "series": "FB-NCD-321",
  //     "tax_free": null,
  //     "option_type": "NONE",
  //     "seniority": "Senior"
  // }

  return (
    <Box
      sx={{
        mx: 1.25,
        borderRadius: 1,
        bgcolor: 'background.paper',
        overflow: 'hidden',
        boxShadow: `0 4px 16px ${alpha(theme.palette.grey[500], 0.24)}`,
        border: `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
        minHeight: 360,
        display: 'flex',
        flexDirection: 'column',

      }}
    >
      {/* Top Section */}
      <Box sx={{ p: 2 }}>
        {/* Top Images Row */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 0.5 }}
        >
          <Box
            component="img"
            src={item?.brandLogo || '/assets/icons/bond-library/company.png'}
            alt="logo"
            sx={{
              width: 70,
              height: 30,
              position: 'relative',
              top: -15,
              right:15,
              mr: 1,
            }}
          />

          <Box
            sx={{
              position: 'relative',
              width: 70,
              left: 20,
              height: 20,
              top: -24,
              ml: 1,
            }}
          >
            {/* Trending Image */}
            <Box
              component="img"
              src="/assets/icons/bond-library/trending.svg"
              alt="Trending"
              sx={{
                width: '100%',
                height: '100%',
              }}
            />

            {/* Centered Text */}
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                top: '70%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: '#fff',

                fontSize: '10px',
                whiteSpace: 'nowrap',
              }}
            >
              {item?.status || 'Trending'}
            </Typography>
          </Box>

        </Stack>

        {/* ASAPL */}
        <Tooltip title={item?.issuer_name || 'N.A.'} arrow>
            <Typography
              variant="subtitle2"
              sx={{
                mt: 0,
                fontWeight: 700,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%', 
                cursor: 'default',
              }}
            >
              {item?.company_name || 'N.A.'}
            </Typography>
          </Tooltip>

        {/* ISIN Number — compact spacing */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mt: 0.5 }}
        >
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            <Box component="span" sx={{ color: 'primary.main' }}>
              ISIN
            </Box>{' '}
            {item?.isin_code || 'N.A.'}
          </Typography>


        </Stack>
      </Box>

      {/* Bottom Section */}
  <Box
  sx={{
    bgcolor: theme.palette.primary.main,
    color: '#fff',
    mt: 'auto',
    p: 2.5,
    borderRadius: 1,
  }}
>
  <Grid container spacing={2}>

    {/* ROW 1 : PRICE - RATING */}
    <Grid item xs={6}>
      <Stack spacing={0.5}>
        <Typography variant="caption" sx={{ opacity: 0.72 }}>
          Price
        </Typography>
        <Typography variant="caption">
          ₹{item?.price || 'N.A.'}
        </Typography>
      </Stack>
    </Grid>

    <Grid item xs={6} sx={{ display: "flex", justifyContent: "center" }}>
      <Stack spacing={0.5} alignItems="center">
        <Box
          sx={{
            width: 45,
            height: 45,
            borderRadius: "50%",
            border: "2px solid #00A76F",
            bgcolor: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              color: "#00A76F",
              whiteSpace: "nowrap",
              overflow: "hidden",
              padding: "4px",
            }}
          >
            {item?.ratings?.[0]?.rating || "N.A."}
          </Typography>
        </Box>
      </Stack>
    </Grid>

    {/* ROW 2 : COUPON - YIELD */}
    <Grid item xs={6}>
      <Stack spacing={0.5}>
        <Typography variant="caption" sx={{ opacity: 0.72 }}>
          Coupon
        </Typography>
        <Typography variant="caption">
          {item?.coupon_rate_percent || "N.A."}%
        </Typography>
      </Stack>
    </Grid>

    <Grid item xs={6}>
      <Stack spacing={0.5}>
        <Typography variant="caption" sx={{ opacity: 0.72 }}>
          Yield
        </Typography>
        <Typography variant="caption">
          {item?.ytm_percent || "N.A."}%
        </Typography>
      </Stack>
    </Grid>

    {/* ROW 3 : IP FREQUENCY - MATURITY DATE */}
    <Grid item xs={6}>
      <Stack spacing={0.5}>
        <Typography variant="caption" sx={{ opacity: 0.72 }}>
          IP Frequency
        </Typography>
        <Typography variant="caption">
          {item?.interest_payment_frequency || "N.A."}
        </Typography>
      </Stack>
    </Grid>

    <Grid item xs={6}>
      <Stack spacing={0.5}>
        <Typography variant="caption" sx={{ opacity: 0.72 }}>
          Maturity Date
        </Typography>
        <Typography variant="caption">
          {item?.maturity_date || "N.A."}
        </Typography>
      </Stack>
    </Grid>

    {/* ROW 4 : TYPE OF BOND */}
    <Grid item xs={6}>
      <Stack spacing={0.5}>
        <Typography variant="caption" sx={{ opacity: 0.72 }}>
          Type of Bond
        </Typography>

        <Typography
          variant="caption"
          noWrap
          sx={{
            maxWidth: "90px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item?.issuer_type || "N.A."}
        </Typography>
      </Stack>
    </Grid>

    <Grid item xs={6}></Grid>

  </Grid>

  {/* BUTTON */}
  <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
    <Button
      size="small"
      variant="contained"
      onClick={handleKnowMore}
      sx={{
        bgcolor: "#fff",
        color: theme.palette.primary.main,
        borderRadius: 20,
        py: 1,
        px: 3,
        fontWeight: 600,
        "&:hover": {
          bgcolor: alpha("#fff", 0.9),
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        },
      }}
    >
      Know More
    </Button>
  </Box>
</Box>


    </Box>
  );
}

BondLibraryCardGrid.propTypes = {
  item: PropTypes.object.isRequired,
};
