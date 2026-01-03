import PropTypes from 'prop-types';
import { Stack, TextField, InputAdornment } from '@mui/material';
import Iconify from 'src/components/iconify';

export default function RtaTableToolbar({ filterName, onFilterName }) {
  return (
    <Stack
      spacing={2}
    
    >
      <TextField
        fullWidth
        value={filterName}
        onChange={(e) => onFilterName(e.target.value)}
        placeholder="Search Rta..."
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

RtaTableToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};
