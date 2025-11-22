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

// ----------------------------------------------------------------------

export default function SchedulerTableRow({ row, selected, onSelectRow, onViewRow, onEditRow }) {
  const { platformName, schedulerType, schedulerFor,interval,date,time } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell>{platformName || 'NA'}</TableCell>

      <TableCell>{schedulerType || 'NA'}</TableCell>
      <TableCell>{schedulerFor || 'NA'}</TableCell>
      <TableCell>{interval || 'NA'}</TableCell>
      <TableCell>
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
      </TableCell>
      <TableCell>{time || 'NA'} </TableCell>

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

SchedulerTableRow.propTypes = {
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
};
