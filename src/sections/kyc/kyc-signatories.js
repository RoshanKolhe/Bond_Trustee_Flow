import { useState } from 'react';
import { m } from 'framer-motion';
// @mui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from 'src/components/iconify';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// components
import { RouterLink } from 'src/routes/components';
import { MotionContainer, varFade } from 'src/components/animate';
import { paths } from 'src/routes/paths';
import KYCTitle from './kyc-title';
import KYCFooter from './kyc-footer';
import KYCAddSignatoriesForm from './kyc-add-signatories-form';

// ----------------------------------------------------------------------

const StyledSearch = styled(TextField)(({ theme }) => ({
  width: 300,
  '& .MuiOutlinedInput-root': {
    height: 40,
    '& fieldset': {
      borderColor: theme.palette.grey[500],
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

// ----------------------------------------------------------------------

// Sample data for the table
const createData = (name, din, email, phone, role) => {
  return { name, din, email, phone, role };
};

const rows = [
  createData('John Doe', '1234567890', 'john@example.com', '+1 234 567 8901', 'Director'),
  createData(
    'Jane Smith',
    '0987654321',
    'jane@example.com',
    '+1 987 654 3210',
    'Authorized Signatory'
  ),
];

export default function KYCSignatories() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredRows = rows.filter((row) =>
    Object.values(row).some(
      (value) => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Container sx={{ position: 'relative', py: { xs: 6, sm: 8, md: 10 } }}>
      <KYCTitle
        title="Authorized Signatories"
        subtitle={'Add director and authorized signatories for your company'}
      />

      <Box
        sx={{
          boxShadow: '0px 0px 12px 0px #00000040',
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: '23px',
        }}
      >
        <Box
          sx={{
            mb: 5,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: { xs: 2, sm: 0 },
            //   boxShadow: '0px 0px 12px 0px #00000040',
            // p: { xs: 2, sm: 3, md: 4 },
            // borderRadius: '23px',
          }}
        >
          <Typography variant="h4" sx={{ mb: { xs: 1, sm: 0 } }}>
            Add Signatories
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            <StyledSearch
              placeholder="Search signatories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: { xs: '100%', sm: 300 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpen}
              sx={{
                height: 40,
                width: { xs: '100%', sm: 'auto' },
                order: { xs: -1, sm: 1 },
              }}
            >
              Add Signatory
            </Button>

            <KYCAddSignatoriesForm open={open} onClose={handleClose} />
          </Box>
        </Box>
        <TableContainer component={Paper} sx={{ mb: 5 }}>
          <Table sx={{ minWidth: 650 }} aria-label="signatories table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="left">DIN</TableCell>
                <TableCell align="left">Role</TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell align="left">Phone</TableCell>
                <TableCell align="left">ID Proof</TableCell>
                <TableCell align="left">Status</TableCell>

                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((row) => (
                <TableRow key={row.din} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="left">{row.din}</TableCell>
                  <TableCell align="left">{row.role}</TableCell>
                  <TableCell align="left">{row.email}</TableCell>
                  <TableCell align="left">{row.phone}</TableCell>
                  <TableCell align="left">{row.idProof}</TableCell>
                  <TableCell align="left">{row.status}</TableCell>
                  <TableCell align="right">
                    <IconButton color="error" aria-label="delete">
                      <Iconify icon="eva:trash-2-outline" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <KYCFooter />
    </Container>
  );
}
