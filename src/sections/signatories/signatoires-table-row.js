import PropTypes from 'prop-types';
// @mui
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
// utils
import { format } from 'date-fns';
import { Box, Chip, IconButton, Tooltip } from '@mui/material';
import Iconify from 'src/components/iconify';
import { color } from 'framer-motion';

// ----------------------------------------------------------------------

const statusMap = {
  1: { label: 'Verified', color: 'success' },
  0: { label: 'Pending', color: 'warning' },
};

export default function SignatoriesTableRow({ row, selected, onSelectRow, onViewRow, onEditRow }) {
  const {
    fullName,
    email,
    designationValue,
    phone,
    submittedDateOfBirth,
    panCardFile,
    boardResolutionFile,
    status,
  } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell>{fullName || 'NA'}</TableCell>

      <TableCell>{email || 'NA'}</TableCell>
      <TableCell>{designationValue || 'NA'}</TableCell>
      <TableCell>{phone || 'NA'}</TableCell>
      <TableCell>
        <Chip label={statusMap[status].label} color={statusMap[status].color} variant="soft" />
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          {/* <Tooltip title="View Events">
            <IconButton onClick={onViewRow}>
              <Iconify icon="carbon:view-filled" />
            </IconButton>
          </Tooltip> */}
          <Tooltip title="Edit" placement="top" arrow>
            <IconButton onClick={onEditRow}>
              <Iconify icon="solar:pen-bold" width={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title="View" placement="top" arrow>
            <IconButton onClick={onViewRow}>
              <Iconify icon="mdi:eye" width={20} />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
}

SignatoriesTableRow.propTypes = {
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
};
