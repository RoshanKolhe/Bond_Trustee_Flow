import PropTypes from 'prop-types';
import { TableRow, TableCell, IconButton, Tooltip } from '@mui/material';
import Iconify from 'src/components/iconify';

export default function AssignedIssueTableRow({ row, onView }) {
  return (
    <TableRow hover>
      <TableCell>{row.companyName}</TableCell>
      <TableCell>{row.cin}</TableCell>
      <TableCell>{row.amount}</TableCell>
      <TableCell>{row.tenure}</TableCell>
      <TableCell>{row.requestedDate}</TableCell>

      <TableCell align="right">
        <Tooltip title="View">
          <IconButton onClick={onView}>
            <Iconify icon="solar:eye-bold" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

AssignedIssueTableRow.propTypes = {
  row: PropTypes.object,
  onView: PropTypes.func,
};
