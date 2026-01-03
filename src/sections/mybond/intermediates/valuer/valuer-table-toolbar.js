import PropTypes from 'prop-types';
import { Stack, TextField, InputAdornment } from '@mui/material';
import Iconify from 'src/components/iconify';

export default function ValuerTableToolbar({ filterName, onFilterName }) {
  return (
    <Stack
      spacing={2}
    >
      <TextField
        fullWidth
        value={filterName}
        onChange={(e) => onFilterName(e.target.value)}
        placeholder="Search Valuer..."
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

ValuerTableToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};
