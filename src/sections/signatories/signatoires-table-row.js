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
      {/* <TableCell>
        <ListItemText
          primary={format(new Date(date), 'dd/MMM/yyyy')}
          secondary={format(new Date(date), 'p')}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell> */}
      <TableCell>
        {submittedDateOfBirth ? format(new Date(submittedDateOfBirth), 'yyyy-MM-dd') : 'NA'}
      </TableCell>
      <TableCell>
        {panCardFile?.fileUrl ? (
          <a
            href={panCardFile.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#1976d2', textDecoration: 'underline' }}
          >
            View
          </a>
        ) : (
          '-'
        )}
      </TableCell>
      <TableCell>
        {boardResolutionFile?.fileUrl ? (
          <a
            href={boardResolutionFile.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#1976d2', textDecoration: 'underline' }}
          >
            View
          </a>
        ) : (
          '-'
        )}
      </TableCell>
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
              <Iconify icon="mdi:pencil" width={20} />
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
