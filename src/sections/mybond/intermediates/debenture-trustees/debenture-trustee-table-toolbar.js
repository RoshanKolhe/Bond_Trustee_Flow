import PropTypes from 'prop-types';
import { Stack, TextField, InputAdornment, Grid } from '@mui/material';
import Iconify from 'src/components/iconify';

export default function DebentureTrusteeTableToolbar({ filterName, onFilterName }) {
  return (

    <Stack
      spacing={2}
      // direction="row"
      // sx={{ p: 2.5 }}
      // alignItems="center"
    >
      <TextField
        fullWidth
        value={filterName}
        onChange={(e) => onFilterName(e.target.value)}
        placeholder="Search Debenture Trustee..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}

DebentureTrusteeTableToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};
