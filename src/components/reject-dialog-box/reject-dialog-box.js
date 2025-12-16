import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

export default function RejectReasonDialog({
  open,
  onClose,
  onSubmit,
  reason,
  setReason,
  title,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Reason for Decline"
          value={reason}
          sx={{ mt: 1 }}
          onChange={(e) => setReason(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button color="error" variant="soft" onClick={onSubmit}>
          Decline
        </Button>
      </DialogActions>
    </Dialog>
  );
}