import PropTypes from 'prop-types';
// @mui
import Button from '@mui/material/Button';

import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import { Tooltip } from '@mui/material';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';


// ----------------------------------------------------------------------

export default function JobTableRow({ row, selected, onViewRow, onSelectRow, onDeleteRow }) {
  const { title, source , company, experience, skills, salary, jobType, createdAt, postedDate } = row;

  const confirm = useBoolean();
  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        {/* Checkbox */}
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        {/* Company Name & Email */}
        <TableCell  sx={{ whiteSpace: 'nowrap' }}>
          {title || 'N/A'}
        </TableCell>

        {/* Address */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{source || 'N/A'}</TableCell>

        {/* Phone Number */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{company || 'N/A'}</TableCell>

        {/* Email */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{experience || 'N/A'}</TableCell>

        {/* Role */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{salary || 'N/A'}</TableCell>

         <TableCell sx={{ whiteSpace: 'nowrap' }}>{jobType || 'N/A'}</TableCell>
         {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>
  <Label color={isSynced === 1 ? 'success' : 'warning'}>
    {isSynced === 1 ? 'Sync' : 'Not Sync'}
  </Label>
</TableCell> */}


<TableCell sx={{ whiteSpace: 'nowrap' }}>
          {postedDate.$date ? new Date(postedDate.$date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }) : 'N/A'}
        </TableCell>

        {/* Created At */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {createdAt.$date ? new Date(createdAt.$date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }) : 'N/A'}
        </TableCell>

        {/* Actions */}
         <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="View Job">
            <IconButton onClick={onViewRow}>
              <Iconify icon="carbon:view-filled" />
            </IconButton>
         </Tooltip>
          {/* <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <ToolTip>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton> */}
        </TableCell> 
      </TableRow>

      {/* Popover */}
      {/* <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top" sx={{ width: 140 }}>
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
      </CustomPopover> */}

      {/* Confirm Delete Dialog */}
      {/* <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={`Are you sure you want to delete ${companyName || ''}?`}
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            View
          </Button>
        }
      /> */}
    </>
  );
}

JobTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};
