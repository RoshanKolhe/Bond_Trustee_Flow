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
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';


// ----------------------------------------------------------------------

export default function BondApplicationsTableRow({ row, selected, onViewRow, onSelectRow, onDeleteRow }) {
  const { id, currentStatus, createdAt } = row;
  const navigate = useNavigate();
  const confirm = useBoolean();
  const popover = usePopover();

  const localStatusMapper = [
    {label: 'Regulatory Filing', code: 'Regulatory filings'},
    {label: 'Trustee Due Diligence', code: 'trustee_due_diligence'},
    {label: 'Principle Listing Approval', code: 'principle_listing_approval'},
    {label: 'ISIN Activation', code: 'isin_activation'},
    {label: 'Execute Documents', code: 'execute_document'},
    {label: 'Launch Issue', code: 'launch_issue'}
  ]

  const getColor = () => {
    if (currentStatus?.code) {
      return 'warning';
    }
    return 'default';
  };
  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {id || 'N/A'}
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={getColor()}
          >
            {(!currentStatus || currentStatus?.code === 'credit_rating_approval') ? localStatusMapper?.find((status) => status.code === localStorage.getItem('activeStepId'))?.label : currentStatus?.label}
          </Label>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {createdAt ? new Date(createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }) : 'N/A'}
        </TableCell>

        {/* Actions */}
        <TableCell align="center" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="View Application">
            <IconButton onClick={() => navigate(paths.dashboard.mybond.bondIssue(id))}>
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

BondApplicationsTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};
