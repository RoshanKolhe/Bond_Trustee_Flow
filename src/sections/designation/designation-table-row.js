import PropTypes from 'prop-types';
// @mui
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
// utils
import { format } from 'date-fns';
import { IconButton, Tooltip } from '@mui/material';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function DesignationTableRow({ row, selected, onSelectRow, onViewRow, onEditRow }) {
  const { designation, description, isActive } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell>{designation || 'NA'}</TableCell>

      <TableCell>{description || 'NA'}</TableCell>
      <TableCell>
      <Label
            variant="soft"
            color={Number(isActive) === 1 ? 'success' : 'error'}
          >
            {Number(isActive) === 1 ? 'Active' : 'In-active'}
          </Label>
          </TableCell>
      <TableCell>
        {/* <Tooltip title="View Events">
            <IconButton onClick={onViewRow}>
              <Iconify icon="carbon:view-filled" />
            </IconButton>
          </Tooltip> */}
        <Tooltip title="Edit" placement="top" arrow>
          <IconButton onClick={onEditRow}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

DesignationTableRow.propTypes = {
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
};
