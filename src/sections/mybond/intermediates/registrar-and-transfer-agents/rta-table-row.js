import PropTypes from 'prop-types';
import {
  TableRow,
  TableCell,
  Avatar,
  IconButton,
  Tooltip,
  Stack,
  Typography,
  Checkbox,
} from '@mui/material';

import Iconify from 'src/components/iconify';

export default function RtaTableRow({ row, selected, onSelectRow, onView, onSendRequest }) {
  const { id, legalEntityName, experience, regulatory, fees, responseTime } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onChange={() => onSelectRow(id)} />
      </TableCell>
      {/* Avatar + Name */}
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar sx={{ mr: 2 }}>{legalEntityName.charAt(0)}</Avatar>
        <Typography variant="body2">{legalEntityName}</Typography>
      </TableCell>

      {/* Experience */}
      <TableCell>{experience} yrs</TableCell>

      {/* Regulatory */}
      <TableCell>{regulatory}</TableCell>

      {/* Fees */}
      <TableCell>{fees}</TableCell>

      {/* Response Time */}
      <TableCell>{responseTime}</TableCell>

      {/* Actions */}
      <TableCell align="center">
        <Stack direction="row" spacing={1} justifyContent="center">
          <Tooltip title="View">
            <IconButton onClick={onView}>
              <Iconify icon="solar:eye-bold" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Send Request">
            <IconButton color="primary" onClick={onSendRequest}>
              <Iconify icon="mdi:email-send" sx={{ color: '#000' }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
}

RtaTableRow.propTypes = {
  row: PropTypes.object,
  onView: PropTypes.func,
  onSendRequest: PropTypes.func,
};
