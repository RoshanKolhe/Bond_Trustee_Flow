import PropTypes from 'prop-types';
import { Stack, TextField } from '@mui/material';

export default function AssignedIssueTableToolbar({ filters, onFilters }) {
  return (
    <Stack
      spacing={2}
      direction="row"
      alignItems="center"
      sx={{ p: 2.5 }}
    >
      <TextField
        fullWidth
        placeholder="Search..."
        value={filters.name}
        onChange={(e) => onFilters('name', e.target.value)}
      />
    </Stack>
  );
}

AssignedIssueTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
};
